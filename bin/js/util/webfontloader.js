// modified from
// https://github.com/tonetheman/phaser3_webfontloaderplugin
// and
// https://github.com/rexrainbow/phaser3-rex-notes/blob/master/plugins/webfontloader-plugin.js

const FILE_POPULATED = Phaser.Loader.FILE_POPULATED;

export class WebFontFile extends Phaser.Loader.File {
    constructor(loader, fileConfig) {
        super(loader, fileConfig);
    }

    load() {
        console.debug('WebFontFile load called', this);
        if (this.state == FILE_POPULATED) {
            this.loader.nextFile(this, true);
        } else {
            var config = this.config;
            config.active = this.onLoad.bind(this);
            config.inactive = this.onError.bind(this);
            config.fontactive = this.onFontActive.bind(this);
            config.fontinactive = this.onFontInactive.bind(this);
            WebFont.load(config);
        }
    }

    onLoad(){
        this.loader.nextFile(this, true);
    }

    onError(){
        this.loader.nextFile(this, false);
    }

    onFontActive(familyName, fvd){
        this.loader.emit('webfontactive', this, familyName);
    }

    onFontInactive(familyName, fvd){
        this.loader.emit('webfontinactive', this, familyName);
    }
}

const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;

let loaderCallback = function (key, config) {
    if (IsPlainObject(key)) {
        config = key;
        if (config.hasOwnProperty('config')) {
            config.type = 'webfont';
            config.url = '';
        } else {
            config = {
                key: 'webfont',
                type: 'webfont',
                url: '',
                config: config
            };
        }
    } else {
        config = {
            type: 'webfont',
            url: '',
            key: key,
            config: config
        };
    }
    this.addFile(new WebFontFile(this, config));
    return this;
};

export class WebFontLoaderPlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager);
        pluginManager.registerFileType('webfont', loaderCallback);
    }

    addToScene(scene) {
        scene.sys.load['webfont'] = loaderCallback;
    }
}
/// <reference path="./phaser.d.ts" />
import {WebFontLoaderPlugin} from './util/webfontloader.js';
import {Load} from './scenes/load.js';
import {Level} from './scenes/level.js';

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 }
        }
    },
    scene: [Load, Level],
    plugins: {
        global: [{
            key: 'WebFontLoader',
            plugin: WebFontLoaderPlugin,
            start: true
        }]
    }
};

var game = new Phaser.Game(config);


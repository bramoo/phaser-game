export class ShapeUtil {

    /**
     * @param {Phaser.GameObjects.Shape} shape 
     */
    static normaliseDimensions(shape) {
        if (shape.scaleX < 0) {
            shape.scaleX *= -1;
            shape.x += (shape.originX - 0.5) * 2 * shape.displayWidth;
        }

        if (shape.scaleY < 0) {
            shape.scaleY *= -1;
            shape.y += (shape.originY - 0.5) * 2 * shape.displayHeight;
        }
    }
}
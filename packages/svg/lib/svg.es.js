/* eslint-disable */
 
/*!
 * @pixi-essentials/svg - v2.0.2
 * Compiled Mon, 10 Jul 2023 02:42:24 UTC
 *
 * @pixi-essentials/svg is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2019-2020, Shukant K. Pal <shukantpal@outlook.com>, All Rights Reserved
 */
import color from 'tinycolor2';
import { GradientFactory } from '@pixi-essentials/gradients';
import { Bounds, Container, DisplayObject } from '@pixi/display';
import { LINE_CAP, LINE_JOIN, GRAPHICS_CURVES, GraphicsGeometry, LineStyle, Graphics, graphicsUtils } from '@pixi/graphics';
import { Point, SHAPES as SHAPES$1, Matrix, Rectangle } from '@pixi/math';
import { Texture, RenderTexture } from '@pixi/core';
import * as libtess from 'libtess';
import dPathParser from 'd-path-parser';
import { CanvasTextureAllocator } from '@pixi-essentials/texture-allocator';
import { Cull } from '@pixi-essentials/cull';
import { Sprite } from '@pixi/sprite';
import { ColorMatrixFilter } from '@pixi/filter-color-matrix';
import '@pixi/events';
import { TextMetrics, TextStyle } from '@pixi/text';

/**
 * @internal
 * @ignore
 */
const _SVG_DOCUMENT_CACHE = new Map();

/**
 * @internal
 * @ignore 
 */
async function _load(href) {
    const url = new URL(href, document.baseURI);
    const id = url.host + url.pathname;
    let doc = _SVG_DOCUMENT_CACHE.get(id);

    if (!doc)
    {
        doc = await fetch(url.toString())
            .then((res) => res.text())
            .then((text) => new DOMParser().parseFromString(text, 'image/svg+xml').documentElement );

        _SVG_DOCUMENT_CACHE.set(id, doc);
    }

    return doc;
}

/**
 * Get information on the internal cache of the SVG loading mechanism.
 * 
 * @public
 * @returns A view on the cache - clear() method and a size property.
 */
function getLoaderCache()


 {
    return {
        clear() {
            _SVG_DOCUMENT_CACHE.clear();
        },
        size: _SVG_DOCUMENT_CACHE.size,
    }
}

/**
 * Inherited paint, used for &lt;use /&gt; elements. The properties used on the inherited paint do not
 * override those on the parent.
 *
 * @public
 */
class InheritedPaintProvider 
{
    
    

    /**
     * Composes a `Paint` that will inherit properties from the `parent` if the `provider` does not
     * define them.
     *
     * @param parent
     * @param provider
     */
    constructor(parent, provider)
    {
        this.parent = parent;
        this.provider = provider;
    }

    get dirtyId()
    {
        return this.parent.dirtyId + this.provider.dirtyId;
    }

    get fill()
    {
        return this.provider.fill !== null ? this.provider.fill : this.parent.fill;
    }

    get opacity()
    {
        return (typeof this.provider.opacity === 'number') ? this.provider.opacity : this.parent.opacity;
    }

    get stroke()
    {
        return this.provider.stroke !== null ? this.provider.stroke : this.parent.stroke;
    }

    get strokeDashArray()
    {
        return Array.isArray(this.provider.strokeDashArray) ? this.provider.strokeDashArray : this.parent.strokeDashArray;
    }

    get strokeDashOffset()
    {
        return typeof this.provider.strokeDashOffset === 'number'
            ? this.provider.strokeDashOffset : this.parent.strokeDashOffset;
    }

    get strokeLineCap()
    {
        return typeof this.provider.strokeLineCap === 'string' ? this.provider.strokeLineCap : this.parent.strokeLineCap;
    }

    get strokeLineJoin()
    {
        return typeof this.provider.strokeLineJoin === 'string' ? this.provider.strokeLineJoin : this.parent.strokeLineJoin;
    }

    get strokeMiterLimit()
    {
        return typeof this.provider.strokeMiterLimit === 'number'
            ? this.provider.strokeMiterLimit : this.parent.strokeMiterLimit;
    }

    get strokeWidth()
    {
        return typeof this.provider.strokeWidth === 'number' ? this.provider.strokeWidth : this.parent.strokeWidth;
    }

    get fillOpacity()
    {
        return (typeof this.provider.fillOpacity === 'number') ? this.provider.fillOpacity : this.parent.fillOpacity;
    }
}

function _optionalChain$2(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



/**
 * Provides the `Paint` for an `SVGElement`. It will also respond to changes in the attributes of the element
 * (not implemented).
 *
 * @public
 */
class PaintProvider 
{
    

    
    
    
    
    
    
    
    
    
    

     __init() {this.dirtyId = 0;}

    /**
     * @param element - The element whose paint is to be provided.
     */
    constructor(element)
    {PaintProvider.prototype.__init.call(this);
        this.element = element;

        const fill = element.getAttribute('fill');
        const fillOpacity = element.getAttribute('fill-opacity');
        const opacity = element.getAttribute('opacity');
        const stroke = element.getAttribute('stroke');
        const strokeDashArray = element.getAttribute('stroke-dasharray');
        const strokeDashOffset = element.getAttribute('stroke-dashoffset');
        const strokeLineCap = element.getAttribute('stroke-linecap');
        const strokeLineJoin = element.getAttribute('stroke-linejoin');
        const strokeMiterLimit = element.getAttribute('stroke-miterlimit');
        const strokeWidth = element.getAttribute('stroke-width');

        /* eslint-disable-next-line no-nested-ternary */
        this.fill = fill !== null ? (fill === 'none' ? 'none' : PaintProvider.parseColor(fill)) : null;
        this.fillOpacity = fillOpacity && parseFloat(fillOpacity);
        this.opacity = opacity && parseFloat(opacity);
        this.stroke = stroke && PaintProvider.parseColor(element.getAttribute('stroke'));
        this.strokeDashArray = strokeDashArray
            && _optionalChain$2([strokeDashArray
, 'optionalAccess', _ => _.split, 'call', _2 => _2(/[, ]+/g)
, 'access', _3 => _3.map, 'call', _4 => _4((num) => parseFloat(num.trim()))]);
        this.strokeDashOffset = strokeDashOffset && parseFloat(strokeDashOffset);
        this.strokeLineCap = strokeLineCap ;
        this.strokeLineJoin = strokeLineJoin ;
        this.strokeMiterLimit = strokeMiterLimit && parseFloat(strokeMiterLimit);
        this.strokeWidth = strokeWidth && parseFloat(strokeWidth);
    }

    /**
     * Parses the color attribute into an RGBA hexadecimal equivalent, if encoded. If the `colorString` is `none` or
     * is a `url(#id)` reference, it is returned as is.
     *
     * @param colorString
     * @see https://github.com/bigtimebuddy/pixi-svg/blob/89e4ab834fa4ef05b64741596516c732eae34daa/src/SVG.js#L106
     */
     static parseColor(colorString)
    {
        /* Modifications have been made. */
        /* Copyright (C) Matt Karl. */

        if (!colorString)
        {
            return 0;
        }
        if (colorString === 'none' || colorString.startsWith('url'))
        {
            return colorString;
        }

        if (colorString[0] === '#')
        {
            // Remove the hash
            colorString = colorString.substr(1);

            // Convert shortcolors fc9 to ffcc99
            if (colorString.length === 3)
            {
                colorString = colorString.replace(/([a-f0-9])/ig, '$1$1');
            }

            return parseInt(colorString, 16);
        }

        const { r, g, b } = color(colorString).toRgb();

        return (r << 16) + (g << 8) + b;
    }
}

/**
 * Converts the linear gradient's x1, x2, y1, y2 attributes into percentage units.
 *
 * @param linearGradient - The linear gradient element whose attributes are to be converted.
 */
function convertLinearGradientAxis(linearGradient)
{
    linearGradient.x1.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE);
    linearGradient.y1.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE);
    linearGradient.x2.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE);
    linearGradient.y2.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE);
}

/**
 * [Paint Servers]{@link https://svgwg.org/svg-next/pservers.html} are implemented as textures. This class is a lazy
 * wrapper around paint textures, which can only be generated using the `renderer` drawing to the screen.
 * 
 * @public
 */
class PaintServer
{
    
    
    

    

    /**
     * Creates a `PaintServer` wrapper.
     *
     * @param paintServer
     * @param paintTexture
     */
    constructor(paintServer, paintTexture)
    {
        this.paintServer = paintServer;
        this.paintTexture = paintTexture;
        this.paintContexts = {};
        this.dirtyId = 0;
    }

    /**
     * Ensures the paint texture is updated for the renderer's WebGL context. This should be called before using the
     * paint texture to render anything.
     *
     * @param renderer - The renderer that will use the paint texture.
     */
     resolvePaint(renderer)
    {
        const contextDirtyId = this.paintContexts[renderer.CONTEXT_UID];
        const dirtyId = this.dirtyId;

        if (contextDirtyId === undefined || contextDirtyId < dirtyId)
        {
            this.updatePaint(renderer);
            this.paintContexts[renderer.CONTEXT_UID] = dirtyId;
        }
    }

    /**
     * Calculates the optimal texture dimensions for the paint texture, given the bounding box of the
     * object applying it. The paint texture is resized accordingly.
     *
     * If the paint texture is sized smaller than the bounding box, then it is expected that it will
     * be scaled up to fit it.
     *
     * @param bbox - The bounding box of the object applying the paint texture.
     */
     resolvePaintDimensions(bbox)
    {
        const bwidth = Math.ceil(bbox.width);
        const bheight = Math.ceil(bbox.height);
        const baspectRatio = bwidth / bheight;

        const paintServer = this.paintServer;
        const paintTexture = this.paintTexture;

        if (paintServer instanceof SVGLinearGradientElement)
        {
            convertLinearGradientAxis(paintServer);

            const colorStops = paintServer.children;
            const x1 = paintServer.x1.baseVal.valueInSpecifiedUnits;
            const y1 = paintServer.y1.baseVal.valueInSpecifiedUnits;
            const x2 = paintServer.x2.baseVal.valueInSpecifiedUnits;
            const y2 = paintServer.y2.baseVal.valueInSpecifiedUnits;

            const mainAxisAngle = Math.atan2(y2 - y1, x2 - x1);
            const mainAxisLength = colorStops.length === 1 ? 2 : 64;
            let width = Math.max(1, mainAxisLength * Math.cos(mainAxisAngle));
            let height = Math.max(1, mainAxisLength * Math.sin(mainAxisAngle));

            if (width < bwidth && height < bheight)
            {
                // If the gradient is not parallel to x- or y- axis, then ensure that the texture's aspect ratio
                // matches that of the bounding box. This will ensure scaling is equal along both axes, and the
                // angle is not skewed due to scaling.
                if (Math.abs(mainAxisAngle) > 1e-2
                    && Math.abs(mainAxisAngle) % (Math.PI / 2) > 1e-2)
                {
                    const aspectRatio = width / height;

                    if (aspectRatio > baspectRatio)
                    {
                        height = width / baspectRatio;
                    }
                    else
                    {
                        width = baspectRatio * height;
                    }
                }

                paintTexture.resize(width, height, true);

                return;
            }
        }

        paintTexture.resize(bwidth, bheight, true);
    }

    /**
     * Renders the paint texture using the renderer immediately.
     *
     * @param renderer - The renderer to use for rendering to the paint texture.
     */
     updatePaint(renderer)
    {
        if (this.paintServer instanceof SVGLinearGradientElement)
        {
            this.linearGradient(renderer);
        }
        else if (this.paintServer instanceof SVGRadialGradientElement)
        {
            this.radialGradient(renderer);
        }
    }

    /**
     * Renders `this.paintServer` as a `SVGLinearGradientElement`.
     *
     * @param renderer - The renderer being used to render the paint texture.
     */
     linearGradient(renderer)
    {
        const linearGradient = this.paintServer ;
        const paintTexture = this.paintTexture;

        convertLinearGradientAxis(linearGradient);

        return GradientFactory.createLinearGradient(
            renderer,
            paintTexture,
            {
                x0: linearGradient.x1.baseVal.valueInSpecifiedUnits * paintTexture.width / 100,
                y0: linearGradient.y1.baseVal.valueInSpecifiedUnits * paintTexture.height / 100,
                x1: linearGradient.x2.baseVal.valueInSpecifiedUnits * paintTexture.width / 100,
                y1: linearGradient.y2.baseVal.valueInSpecifiedUnits * paintTexture.height / 100,
                colorStops: this.createColorStops(linearGradient.children),
            },
        );
    }

    /**
     * Renders `this.paintServer` as a `SVGRadialGradientElement`.
     *
     * @param renderer - The renderer being used to render the paint texture.
     */
     radialGradient(renderer)
    {
        const radialGradient = this.paintServer ;
        const paintTexture = this.paintTexture;

        radialGradient.fx.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_NUMBER);
        radialGradient.fy.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_NUMBER);
        radialGradient.cx.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_NUMBER);
        radialGradient.cy.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_NUMBER);

        return GradientFactory.createRadialGradient(
            renderer,
            paintTexture,
            {
                x0: radialGradient.fx.baseVal.valueInSpecifiedUnits * paintTexture.width / 100,
                y0: radialGradient.fy.baseVal.valueInSpecifiedUnits * paintTexture.height / 100,
                r0: radialGradient.fr.baseVal.valueInSpecifiedUnits * paintTexture.width / 100,
                x1: radialGradient.cx.baseVal.valueInSpecifiedUnits * paintTexture.width / 100,
                y1: radialGradient.cy.baseVal.valueInSpecifiedUnits * paintTexture.height / 100,
                r1: radialGradient.r.baseVal.valueInSpecifiedUnits * paintTexture.width / 100,
                colorStops: this.createColorStops(radialGradient.children),
            },
        );
    }

    /**
     * Extracts the color-stops from the children of a `SVGGradientElement`.
     *
     * @param stopElements - The children of a `SVGGradientElement`. You can get it via `element.children`.
     * @return The color stops that can be fed into {@link GradientFactory}.
     */
     createColorStops(stopElements)
    {
        const colorStops = [];

        for (let i = 0, j = stopElements.length; i < j; i++)
        {
            const stopElement = stopElements.item(i) ;

            colorStops.push({
                offset: stopElement.offset.baseVal,
                color: PaintProvider.parseColor(stopElement.getAttribute('stop-color')) ,
            });
        }

        return colorStops;
    }
}

/** @internal */
const PATH = 100;

/**
 * @ignore
 * @public
 */


/**
 * The fill rules supported by {@link Path}.
 * 
 * @public
 */
var FILL_RULE; (function (FILL_RULE) {
    const NONZERO = 'nonzero'; FILL_RULE["NONZERO"] = NONZERO;
    const EVENODD = 'evenodd'; FILL_RULE["EVENODD"] = EVENODD;
})(FILL_RULE || (FILL_RULE = {}));

/**
 * Shape extension for Graphics
 * 
 * @public
 */
class Path
{
    /**
     * The list of contours of this path, where a contour is a list of points.
     *
     * @member {Array.Array.<number>>}
     */
    

    /** The fill rule of this path. */
    

    /** The type of shape. This is always equal to 100 for now. */
    

    /** Whether the calculated bounds are dirty. */
    

    /** The calculated bounds of this path. */
     __init() {this.bounds = new Bounds();}

    /**
     * Initializes the path with zero contours and a non-zero fill rule.
     */
    constructor()
    {Path.prototype.__init.call(this);
        this.contours = [];
        this.fillRule = FILL_RULE.NONZERO;
        this.type = PATH;
        this.dirty = true;
    }

    /**
     * Gets the points of the last contour in this path. If there are no contours, one is created.
     */
    get points()
    {
        if (!this.contours.length)
        {
            this.contours.push([]);
        }

        return this.contours[this.contours.length - 1];
    }

    /**
     * Calculates whether the point (x, y) is inside this path or not.
     *
     * @param x - The x-coordinate of the point.
     * @param y - The y-coordinate of the point.
     * @return Whether (x, y) is inside this path.
     */
    contains(x, y)
    {
        if (this.dirty)
        {
            this.calculateBounds();
            this.dirty = false;
        }

        const bounds = this.bounds;

        if (x < bounds.minX || y < bounds.minY ||
            x > bounds.maxX || y > bounds.maxY)
        {
            return false;
        }

        if (this.fillRule === FILL_RULE.EVENODD)
        {
            return this.hitEvenOdd(x, y);
        }
        else if (this.fillRule === FILL_RULE.NONZERO)
        {
            return this.hitNonZero(x, y);
        }

        return false;
    }

    /**
     * Clone this path.
     */
    clone()
    {
        const contours = this.contours.map((c) => [...c]);
        const path = new Path();

        path.contours = contours;
        path.fillRule = this.fillRule;

        return path;
    }

    /**
     * Closes the last contour of this path and pushes a new one.
     */
    closeContour()
    {
        if (this.points.length === 0)
        {
            return;
        }

        this.contours.push([]);
    }

    /**
     * This should be called when the path is updated so that the hit-testing bounds are recalculated.
     */
    invalidate()
    {
        this.dirty = true;
    }

    toString()
    {
        return `[@pixi-essentials/svg:Path Don't expect points to be printed :P]`;
    }

    /**
     * Recalculates the bounds of this path and sets {@link Path.bounds this.bounds}.
     */
     calculateBounds()
    {
        const bounds = this.bounds;

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const contour of this.contours)
        {
            for (let i = 0, j = contour.length; i < j;)
            {
                const x = contour[i++];
                const y = contour[i++];

                minX = x < minX ? x : minX;
                minY = y < minY ? y : minY;
                maxX = x > maxX ? x : maxX;
                maxY = y > maxY ? y : maxY;
            }
        }

        bounds.minX = minX;
        bounds.minY = minY;
        bounds.maxX = maxX;
        bounds.maxY = maxY;
    }
    
    /**
     * Hit-tests the point (x, y) based on the even-odd fill rule.
     * 
     * @see http://geomalgorithms.com/a03-_inclusion.html
     */
     hitEvenOdd(x, y)
    {
        // Here, we do we a ray tracing of a horizontally line extending from (x, y) infinitely towards the
        // right. The number of edges crossing this ray are counted.
        let crossingCount = 0;
        
        for (const contour of this.contours)
        {
            for (let i = 0, j = contour.length; i < j;)
            {
                const x0 = contour[i++];
                const y0 = contour[i++];
                const x1 = contour[i % contour.length];
                const y1 = contour[(i + 1) % contour.length];

                if ((y0 < y && y1 > y) ||  // Downward crossing
                    (y0 > y && y1 < y))    // Upward crossing
                {
                    // Calculate the x-coordinate of the point of intersection.
                    const it = (y - y0) / (y1 - y0);
                    const ix = x0 + it * (x1  - x0);

                    if (x < ix)
                    {
                        ++crossingCount;
                    }
                }
            }
        }

        return !!(crossingCount % 2);
    }

    /**
     * Hit-tests the point (x, y) based on non-zero fill rule.
     *
     * @see http://geomalgorithms.com/a03-_inclusion.html
     */
     hitNonZero(x, y)
    {
        // Calculate the winding number of (x, y) by finding the net number of edges that cross the horizontal ray
        // from (x, y) upwards minus downwards.
        let windingNumber = 0;

        for (const contour of this.contours)
        {
            for (let i = 0, j = contour.length; i < j;)
            {
                const x0 = contour[i++];
                const y0 = contour[i++];
                const x1 = contour[i % contour.length];
                const y1 = contour[(i + 1) % contour.length];

                if (y0 <= y)
                {
                    if (y1 > y &&   // Cross downward
                        calculateSide(
                            x, y,
                            x0, y0,
                            x1, y1
                        ) > 0)      // (x, y) left of edge
                    {
                        ++windingNumber;
                    }
                }
                else if (y1 <= y)    // Cross upward
                {
                    if (calculateSide(
                        x, y,
                        x0, y0,
                        x1, y1
                    ) < 0)           // (x, y) right of edge
                    {
                        --windingNumber;
                    }                   
                }
            }
        }

        // Winding number will be zero for points outside the shape.
        return windingNumber !== 0;
    }
}

/**
 * Calculates whether (x, y) is left, on, or right of the line extending through (x0, y0) and (x1, y1).
 *
 * @ignore
 * @return > 0 if on on left side, = 0 if on line, < 0 if on right side
 */
function calculateSide(x, y, x0, y0, x1, y1)
{
    // Basically calculate the area of the triangle (x0, y0), (x1, y1), (x, y), with vertices
    // in that order. If counterlockwise, then the area is positive - then (x, y) is on left;

    return (x1 - x0) * (y - y0) -  (x - x0) * (y1 - y0);
}

function distanceTo(p0, p1)
{
    return Math.sqrt(((p0.x - p1.x) ** 2) + ((p0.y - p1.y) ** 2)); 
}

/**
 * Buffers vertices to draw a square cap.
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param {number} x - X-coord of end point
 * @param {number} y - Y-coord of end point
 * @param {number} nx - X-coord of line normal pointing inside
 * @param {number} ny - Y-coord of line normal pointing inside
 * @param {Array<number>} verts - vertex buffer
 * @returns {}
 */
function square(
    x,
    y,
    nx,
    ny,
    innerWeight,
    outerWeight,
    clockwise, /* rotation for square (true at left end, false at right end) */
    verts,
)
{
    const ix = x - (nx * innerWeight);
    const iy = y - (ny * innerWeight);
    const ox = x + (nx * outerWeight);
    const oy = y + (ny * outerWeight);

    /* Rotate nx,ny for extension vector */
    let exx; let
        eyy;

    if (clockwise)
    {
        exx = ny;
        eyy = -nx;
    }
    else
    {
        exx = -ny;
        eyy = nx;
    }

    /* [i|0]x,y extended at cap */
    const eix = ix + exx;
    const eiy = iy + eyy;
    const eox = ox + exx;
    const eoy = oy + eyy;

    /* Square itself must be inserted clockwise*/
    verts.push(eix, eiy);
    verts.push(eox, eoy);

    return 2;
}

/**
 * Buffers vertices to draw an arc at the line joint or cap.
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param {number} cx - X-coord of center
 * @param {number} cy - Y-coord of center
 * @param {number} sx - X-coord of arc start
 * @param {number} sy - Y-coord of arc start
 * @param {number} ex - X-coord of arc end
 * @param {number} ey - Y-coord of arc end
 * @param {Array<number>} verts - buffer of vertices
 * @param {boolean} clockwise - orientation of vertices
 * @returns {number} - no. of vertices pushed
 */
function round(
    cx,
    cy,
    sx,
    sy,
    ex,
    ey,
    verts,
    clockwise, /* if not cap, then clockwise is turn of joint, otherwise rotation from angle0 to angle1 */
)
{
    const cx2p0x = sx - cx;
    const cy2p0y = sy - cy;

    let angle0 = Math.atan2(cx2p0x, cy2p0y);
    let angle1 = Math.atan2(ex - cx, ey - cy);

    if (clockwise && angle0 < angle1)
    {
        angle0 += Math.PI * 2;
    }
    else if (!clockwise && angle0 > angle1)
    {
        angle1 += Math.PI * 2;
    }

    let startAngle = angle0;
    const angleDiff = angle1 - angle0;
    const absAngleDiff = Math.abs(angleDiff);

    /* if (absAngleDiff >= PI_LBOUND && absAngleDiff <= PI_UBOUND)
    {
        const r1x = cx - nxtPx;
        const r1y = cy - nxtPy;

        if (r1x === 0)
        {
            if (r1y > 0)
            {
                angleDiff = -angleDiff;
            }
        }
        else if (r1x >= -GRAPHICS_CURVES.epsilon)
        {
            angleDiff = -angleDiff;
        }
    }*/

    const radius = Math.sqrt((cx2p0x * cx2p0x) + (cy2p0y * cy2p0y));
    const segCount = ((15 * absAngleDiff * Math.sqrt(radius) / Math.PI) >> 0) + 1;
    const angleInc = angleDiff / segCount;

    startAngle += angleInc;

    if (clockwise)
    {
        verts.push(cx, cy);
        verts.push(sx, sy);

        for (let i = 1, angle = startAngle; i < segCount; i++, angle += angleInc)
        {
            verts.push(cx, cy);
            verts.push(cx + ((Math.sin(angle) * radius)),
                cy + ((Math.cos(angle) * radius)));
        }

        verts.push(cx, cy);
        verts.push(ex, ey);
    }
    else
    {
        verts.push(sx, sy);
        verts.push(cx, cy);

        for (let i = 1, angle = startAngle; i < segCount; i++, angle += angleInc)
        {
            verts.push(cx + ((Math.sin(angle) * radius)),
                cy + ((Math.cos(angle) * radius)));
            verts.push(cx, cy);
        }

        verts.push(ex, ey);
        verts.push(cx, cy);
    }

    return segCount * 2;
}
/**
 * Adapted from @pixi/graphics - buildNonNativeLine
 *
 * Builds a line to draw using the polygon method.
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 */
function buildDash(points, style, graphicsGeometry)
{
    // get first and last point.. figure out the middle!

    const verts = graphicsGeometry.points;
    const length = points.length / 2;
    let indexCount = points.length;
    const indexStart = verts.length / 2;

    // Max. inner and outer width
    const width = style.width / 2;
    const widthSquared = width * width;
    const miterLimitSquared = style.miterLimit * style.miterLimit;

    /* Line segments of interest where (x1,y1) forms the corner. */
    let x0 = points[0];
    let y0 = points[1];
    let x1 = points[2];
    let y1 = points[3];
    let x2 = 0;
    let y2 = 0;

    /* perp[?](x|y) = the line normal with magnitude lineWidth. */
    let perpx = -(y0 - y1);
    let perpy = x0 - x1;
    let perp1x = 0;
    let perp1y = 0;

    let dist = Math.sqrt((perpx * perpx) + (perpy * perpy));

    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;

    const ratio = style.alignment;// 0.5;
    const innerWeight = (1 - ratio) * 2;
    const outerWeight = ratio * 2;

    // if (!closedShape)
    // {
    if (style.cap === LINE_CAP.ROUND)
    {
        indexCount += round(
            x0 - (perpx * (innerWeight - outerWeight) * 0.5),
            y0 - (perpy * (innerWeight - outerWeight) * 0.5),
            x0 - (perpx * innerWeight),
            y0 - (perpy * innerWeight),
            x0 + (perpx * outerWeight),
            y0 + (perpy * outerWeight),
            verts,
            true,
        ) + 2;
    }
    else if (style.cap === LINE_CAP.SQUARE)
    {
        indexCount += square(x0, y0, perpx, perpy, innerWeight, outerWeight, true, verts);
    }
    // }

    // Push first point (below & above vertices)
    verts.push(
        x0 - (perpx * innerWeight),
        y0 - (perpy * innerWeight));
    verts.push(
        x0 + (perpx * outerWeight),
        y0 + (perpy * outerWeight));

    for (let i = 1; i < length - 1; ++i)
    {
        x0 = points[(i - 1) * 2];
        y0 = points[((i - 1) * 2) + 1];

        x1 = points[i * 2];
        y1 = points[(i * 2) + 1];

        x2 = points[(i + 1) * 2];
        y2 = points[((i + 1) * 2) + 1];

        perpx = -(y0 - y1);
        perpy = x0 - x1;

        dist = Math.sqrt((perpx * perpx) + (perpy * perpy));
        perpx /= dist;
        perpy /= dist;
        perpx *= width;
        perpy *= width;

        perp1x = -(y1 - y2);
        perp1y = x1 - x2;

        dist = Math.sqrt((perp1x * perp1x) + (perp1y * perp1y));
        perp1x /= dist;
        perp1y /= dist;
        perp1x *= width;
        perp1y *= width;

        /* d[x|y](0|1) = the component displacment between points p(0,1|1,2) */
        const dx0 = x1 - x0;
        const dy0 = y0 - y1;
        const dx1 = x1 - x2;
        const dy1 = y2 - y1;

        /* +ve if internal angle counterclockwise, -ve if internal angle clockwise. */
        const cross = (dy0 * dx1) - (dy1 * dx0);
        const clockwise = (cross < 0);

        /* Going nearly straight? */
        if (Math.abs(cross) < 0.1)
        {
            verts.push(
                x1 - (perpx * innerWeight),
                y1 - (perpy * innerWeight));
            verts.push(
                x1 + (perpx * outerWeight),
                y1 + (perpy * outerWeight));

            continue;
        }

        /* p[x|y] is the miter point. pdist is the distance between miter point and p1. */
        const c1 = ((-perpx + x0) * (-perpy + y1)) - ((-perpx + x1) * (-perpy + y0));
        const c2 = ((-perp1x + x2) * (-perp1y + y1)) - ((-perp1x + x1) * (-perp1y + y2));
        const px = ((dx0 * c2) - (dx1 * c1)) / cross;
        const py = ((dy1 * c1) - (dy0 * c2)) / cross;
        const pdist = ((px - x1) * (px - x1)) + ((py - y1) * (py - y1));

        /* Inner miter point */
        const imx = x1 + ((px - x1) * innerWeight);
        const imy = y1 + ((py - y1) * innerWeight);
        /* Outer miter point */
        const omx = x1 - ((px - x1) * outerWeight);
        const omy = y1 - ((py - y1) * outerWeight);

        if (style.join === LINE_JOIN.BEVEL || pdist / widthSquared > miterLimitSquared)
        {
            if (clockwise) /* rotating at inner angle */
            {
                verts.push(imx, imy);// inner miter point
                verts.push(x1 + (perpx * outerWeight), y1 + (perpy * outerWeight));// first segment's outer vertex
                verts.push(imx, imy);// inner miter point
                verts.push(x1 + (perp1x * outerWeight), y1 + (perp1y * outerWeight));// second segment's outer vertex
            }
            else /* rotating at outer angle */
            {
                verts.push(x1 - (perpx * innerWeight), y1 - (perpy * innerWeight));// first segment's inner vertex
                verts.push(omx, omy);// outer miter point
                verts.push(x1 - (perp1x * innerWeight), y1 - (perp1y * innerWeight));// second segment's outer vertex
                verts.push(omx, omy);// outer miter point
            }

            indexCount += 2;
        }
        else if (style.join === LINE_JOIN.ROUND)
        {
            if (clockwise) /* arc is outside */
            {
                verts.push(imx, imy);
                verts.push(x1 + (perpx * outerWeight), y1 + (perpy * outerWeight));

                indexCount += round(
                    x1, y1,
                    x1 + (perpx * outerWeight), y1 + (perpy * outerWeight),
                    x1 + (perp1x * outerWeight), y1 + (perp1y * outerWeight),
                    verts, true,
                ) + 4;

                verts.push(imx, imy);
                verts.push(x1 + (perp1x * outerWeight), y1 + (perp1y * outerWeight));
            }
            else /* arc is inside */
            {
                verts.push(x1 - (perpx * innerWeight), y1 - (perpy * innerWeight));
                verts.push(omx, omy);

                indexCount += round(
                    x1, y1,
                    x1 - (perpx * innerWeight), y1 - (perpy * innerWeight),
                    x1 - (perp1x * innerWeight), y1 - (perp1y * innerWeight),
                    verts, false
                ) + 4;

                verts.push(x1 - (perp1x * innerWeight), y1 - (perp1y * innerWeight));
                verts.push(omx, omy);
            }
        }
        else
        {
            verts.push(imx, imy);
            verts.push(omx, omy);
        }
    }

    x0 = points[(length - 2) * 2];
    y0 = points[((length - 2) * 2) + 1];

    x1 = points[(length - 1) * 2];
    y1 = points[((length - 1) * 2) + 1];

    perpx = -(y0 - y1);
    perpy = x0 - x1;

    dist = Math.sqrt((perpx * perpx) + (perpy * perpy));
    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;

    verts.push(x1 - (perpx * innerWeight), y1 - (perpy * innerWeight));
    verts.push(x1 + (perpx * outerWeight), y1 + (perpy * outerWeight));

    // if (!closedShape)
    // {
    if (style.cap === LINE_CAP.ROUND)
    {
        indexCount += round(
            x1 - (perpx * (innerWeight - outerWeight) * 0.5),
            y1 - (perpy * (innerWeight - outerWeight) * 0.5),
            x1 - (perpx * innerWeight),
            y1 - (perpy * innerWeight),
            x1 + (perpx * outerWeight),
            y1 + (perpy * outerWeight),
            verts,
            false
        ) + 2;
    }
    else if (style.cap === LINE_CAP.SQUARE)
    {
        indexCount += square(x1, y1, perpx, perpy, innerWeight, outerWeight, false, verts);
    }
    // }

    const indices = graphicsGeometry.indices;
    const eps2 = GRAPHICS_CURVES.epsilon * GRAPHICS_CURVES.epsilon;

    // indices.push(indexStart);
    for (let i = indexStart; i < indexCount + indexStart - 2; ++i)
    {
        x0 = verts[(i * 2)];
        y0 = verts[(i * 2) + 1];

        x1 = verts[(i + 1) * 2];
        y1 = verts[((i + 1) * 2) + 1];

        x2 = verts[(i + 2) * 2];
        y2 = verts[((i + 2) * 2) + 1];

        /* Skip zero area triangles */
        if (Math.abs((x0 * (y1 - y2)) + (x1 * (y2 - y0)) + (x2 * (y0 - y1))) < eps2)
        {
            continue;
        }

        indices.push(i, i + 1, i + 2);
    }
}

function inDash(i) { return i % 2 === 0; }
function incDash(i, dashArray) { return (i + 1) % dashArray.length; }

function buildDashedLine(graphicsData, graphicsGeometry)
{
    const shape = graphicsData.shape ;
    let points = graphicsData.points || shape.points.slice();
    const eps = graphicsGeometry.closePointEps;

    if (points.length === 0)
    {
        return;
    }

    const firstPoint = new Point(points[0], points[1]);
    const lastPoint = new Point(points[points.length - 2], points[points.length - 1]);

    const closedShape = shape.type !== SHAPES$1.POLY || shape.closeStroke;
    const closedPath = Math.abs(firstPoint.x - lastPoint.x) < eps
        && Math.abs(firstPoint.y - lastPoint.y) < eps;

    // if the first point is the last point - gonna have issues :)
    if (closedShape)
    {
        // need to clone as we are going to slightly modify the shape..
        points = points.slice();

        if (closedPath)
        {
            points.pop();
            points.pop();
            lastPoint.set(points[points.length - 2], points[points.length - 1]);
        }

        const midPointX = (firstPoint.x + lastPoint.x) * 0.5;
        const midPointY = (lastPoint.y + firstPoint.y) * 0.5;

        points.unshift(midPointX, midPointY);
        points.push(midPointX, midPointY);
    }

    const style = graphicsData.lineStyle;

    // The length into the current dash that was already been added. This is needed for dashes
    // that cover multiple line segments (e.g. path turns in middle of dash).
    let dashOffset = (style ).dashOffset || 0;

    // Local copy of dash array
    const dashArray = (style ).dashArray || [10, 5];

    // Number of line segments
    const segCount = (points.length / 2) - 1;

    // Start of each segment
    const segStart = new Point();

    // End of each segement
    const segEnd = new Point();
    
    // Holds points for the dashes. When drawing a dash, this must contain more than one point. It
    // may contain more than 2 points if the dash spans across multiple segments.
    const segPoints = [];

    // The current head of the dash algorithm
    const dashPointer = new Point();

    // The index in dashArray of location in the path at dashPointer
    let dashArrayIndex = 0;

    // Loop expects start of dash to already be present
    segPoints.push(points[0], points[1]);

    for (let i = 0; i < segCount; i++)
    {
        // Segment start point
        segStart.set(points[i * 2], points[(i * 2) + 1]);

        // Segment end point
        segEnd.set(points[(i * 2) + 2], points[(i * 2) + 3]);

        // Segment length
        const segLength = distanceTo(segStart, segEnd);

        const segAngle = Math.atan2(segEnd.y - segStart.y, segEnd.x - segStart.x);
        const segSin = Math.sin(segAngle);
        const segCos = Math.cos(segAngle);

        let segSpace = segLength;

        dashPointer.copyFrom(segStart);

        while (segSpace >= (dashArray[dashArrayIndex] - dashOffset))
        {
            const dashLength = dashArray[dashArrayIndex] - dashOffset;

            dashPointer.x += segCos * dashLength;
            dashPointer.y += segSin * dashLength;
            segPoints.push(dashPointer.x, dashPointer.y);

            if (inDash(dashArrayIndex))
            {
                buildDash(segPoints, style, graphicsGeometry);
                segPoints.length = 0;
            }

            segSpace -= dashLength;
            dashArrayIndex = incDash(dashArrayIndex, dashArray);
            dashOffset = 0;
        }

        if (segSpace > 0)
        {
            if (inDash(dashArrayIndex))
            {
                segPoints.push(segEnd.x, segEnd.y);
            }

            dashOffset += segSpace;
        }
    }

    if (inDash(dashArrayIndex))
    {
        buildDash(segPoints, style, graphicsGeometry);
    }
}

const tmpBounds = new Bounds();

// @pixi/graphics should export this, ugh!
var SHAPES; (function (SHAPES) {
    const POLY = 0; SHAPES[SHAPES["POLY"] = POLY] = "POLY";
    const RECT = 1; SHAPES[SHAPES["RECT"] = RECT] = "RECT";
    const CIRC = 2; SHAPES[SHAPES["CIRC"] = CIRC] = "CIRC";
    const ELIP = 3; SHAPES[SHAPES["ELIP"] = ELIP] = "ELIP";
    const RREC = 4; SHAPES[SHAPES["RREC"] = RREC] = "RREC";
})(SHAPES || (SHAPES = {}));

/** @public */
class SVGGraphicsGeometry extends GraphicsGeometry
{
    processLine(data)
    {
        // @ts-expect-error Because we are extending the Shape enum.
        if (data.shape.type === PATH)
        {
            this.processPathLine(data);

            return;
        }

        const lineStyle = data.lineStyle ;

        if (!lineStyle.dashArray)
        {
            super.processLine(data);
        }
        else
        {
            buildDashedLine(data, this);
        }
    }

    processPathLine(data)
    {
        const path = data.shape ;
        const lineStyle = data.lineStyle ;

        path.contours.forEach((contour) =>
        {
            if (contour.find((e) => isNaN(e)) !== undefined)
            {
                console.error('Contour has NaN, oops!');

                return;
            }

            if (lineStyle.dashArray)
            {
                buildDashedLine(
                    {
                        points: contour,
                        holes: [],

                        // @ts-expect-error
                        shape: { points: contour, type: SHAPES.POLY },
                        lineStyle,
                    },
                    this,
                );
            }
            else
            {
                super.processLine({
                    closeStroke: true,
                    points: contour.slice(),
                    holes: [],

                    // @ts-expect-error
                    shape: { points: contour, type: SHAPES.POLY },
                    lineStyle,
                });
            }
        });
    }

     calculateBounds()
    {
        const bounds = this._bounds;
        const sequenceBounds = tmpBounds;
        let curMatrix = Matrix.IDENTITY;

        this._bounds.clear();
        sequenceBounds.clear();

        for (let i = 0; i < this.graphicsData.length; i++)
        {
            const data = this.graphicsData[i];
            const shape = data.shape;
            const type = data.type;
            const lineStyle = data.lineStyle;
            const nextMatrix = data.matrix || Matrix.IDENTITY;
            let lineWidth = 0.0;

            if (lineStyle && lineStyle.visible)
            {
                const alignment = lineStyle.alignment;

                lineWidth = lineStyle.width;

                if (type === SHAPES.POLY)
                {
                    lineWidth = lineWidth * (0.5 + Math.abs(0.5 - alignment));
                }
                else
                {
                    lineWidth = lineWidth * Math.max(0, alignment);
                }
            }

            if (curMatrix !== nextMatrix)
            {
                if (!sequenceBounds.isEmpty())
                {
                    bounds.addBoundsMatrix(sequenceBounds, curMatrix);
                    sequenceBounds.clear();
                }
                curMatrix = nextMatrix;
            }

            if (type === SHAPES.RECT || type === SHAPES.RREC)
            {
                const rect = shape ;

                sequenceBounds.addFramePad(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height,
                    lineWidth, lineWidth);
            }
            else if (type === SHAPES.CIRC)
            {
                const circle = shape ;

                sequenceBounds.addFramePad(circle.x, circle.y, circle.x, circle.y,
                    circle.radius + lineWidth, circle.radius + lineWidth);
            }
            else if (type === SHAPES.ELIP)
            {
                const ellipse = shape ;

                sequenceBounds.addFramePad(ellipse.x, ellipse.y, ellipse.x, ellipse.y,
                    ellipse.width + lineWidth, ellipse.height + lineWidth);
            }
            // @ts-expect-error Because we are extending the Shape enum.
            else if (type === PATH)
            {
                const path = shape ;

                path.contours.forEach((contour) =>
                {
                    bounds.addVerticesMatrix(Matrix.IDENTITY, new Float32Array(contour), 0, contour.length);
                });
            }
            else
            {
                const poly = shape ;
                // adding directly to the bounds

                bounds.addVerticesMatrix(curMatrix, (poly.points ), 0, poly.points.length, lineWidth, lineWidth);
            }
        }

        if (!sequenceBounds.isEmpty())
        {
            bounds.addBoundsMatrix(sequenceBounds, curMatrix);
        }

        bounds.pad(this.boundsPadding, this.boundsPadding);
    }
}

class DashedLineStyle extends LineStyle
{constructor(...args) { super(...args); DashedLineStyle.prototype.__init.call(this);DashedLineStyle.prototype.__init2.call(this); }
    /**
     * The dashing pattern of dashes and gaps to stroke paths.
     */
     __init() {this.dashArray = null;}

    /**
     * The distance into the dash pattern to start from.
     */
     __init2() {this.dashOffset = 0;}

    /**
     * @override
     */
     clone()
    {
        const obj = super.clone() ;

        obj.dashArray = this.dashArray ? [...this.dashArray] : null;
        obj.dashOffset = this.dashOffset;

        return obj;
    }

    /**
     * @override
     */
     reset()
    {
        super.reset();

        this.dashArray = null;
        this.dashOffset = 0;
    }
}

const EllipticArcUtils = {
    /**
     * Approximates the arc length of an elliptical arc using numerical integration.
     *
     * @ignore
     * @param rx - The radius along the x-axis.
     * @param ry - The radius along the y-axis.
     * @param startAngle - The starting eccentric angle, in radians.
     * @param sweepAngle - The change in eccentric angle, in radians. This should be in the range (-2π, 2π).
     * @param da - The size of angle intervals used in the Riemann sum.
     * @see https://math.stackexchange.com/questions/433094/how-to-determine-the-arc-length-of-ellipse
     */
    calculateArcLength(rx, ry, startAngle, sweepAngle, da = 0.05)
    {
        // We are integrating r(x) = √(a²sin²t + b²cos²t), which is used in the form √(a² + (b² - a²)cos²t)
        // to reduce computations.

        const sweepSign = Math.sign(sweepAngle);
        const sweepAbsolute = Math.abs(sweepAngle);
        const rx2 = rx * rx;
        const ry2 = ry * ry;
        const rdiff2 = ry2 - rx2;

        let arcLength = 0;

        // Samples are taken in the middle of each interval
        for (let a = startAngle + (da * 0.5), delta = 0; delta < sweepAbsolute; a += sweepSign * da, delta += da)
        {
            const cos = Math.cos(a);
            const cos2 = cos * cos;
            const sample = Math.sqrt(rx2 + (rdiff2 * cos2));

            arcLength += da * sample;
        }

        return arcLength;
    },
};

/**
 * @public
 * @ignore
 */


















const tempMatrix$2 = new Matrix();

const _segmentsCount 
    = (GRAPHICS_CURVES )._segmentsCount.bind(GRAPHICS_CURVES);

/**
 * This node can be used to directly embed the following elements:
 *
 * | Interface           | Element            |
 * | ------------------- | ------------------ |
 * | SVGGElement         | &lt;g /&gt;        |
 * | SVGCircleElement    | &lt;circle /&gt;   |
 * | SVGLineElement      | &lt;line /&gt;     |
 * | SVGPolylineElement  | &lt;polyline /&gt; |
 * | SVGPolygonElement   | &lt;polygon /&gt;  |
 * | SVGRectElement      | &lt;rect /&gt;     |
 *
 * It also provides an implementation for dashed stroking, by adding the `dashArray` and `dashOffset` properties
 * to `LineStyle`.
 * 
 * @public
 */
class SVGGraphicsNode extends Graphics
{
    

    

    constructor(context)
    {
        super();

        this.context = context;

        (this )._geometry = new SVGGraphicsGeometry();
        (this )._geometry.refCount++;

        this._lineStyle = new DashedLineStyle();

        this.paintServers = [];
    }

     lineTextureStyle(options)
    {
        // Apply defaults
        options = Object.assign({
            width: 0,
            texture: Texture.WHITE,
            color: (options && options.texture) ? 0xFFFFFF : 0x0,
            alpha: 1,
            matrix: null,
            alignment: 0.5,
            native: false,
            cap: LINE_CAP.BUTT,
            join: LINE_JOIN.MITER,
            miterLimit: 10,
            dashArray: null,
            dashOffset: 0,
        }, options);

        if (this.currentPath)
        {
            this.startPoly();
        }

        const visible = options.width > 0 && options.alpha > 0;

        if (!visible)
        {
            this._lineStyle.reset();
        }
        else
        {
            if (options.matrix)
            {
                options.matrix = options.matrix.clone();
                options.matrix.invert();
            }

            Object.assign(this._lineStyle, { visible }, options);
        }

        return this;
    }

    /**
     * Draws an elliptical arc.
     *
     * @param cx - The x-coordinate of the center of the ellipse.
     * @param cy - The y-coordinate of the center of the ellipse.
     * @param rx - The radius along the x-axis.
     * @param ry - The radius along the y-axis.
     * @param startAngle - The starting eccentric angle, in radians (0 is at the 3 o'clock position of the arc's circle).
     * @param endAngle - The ending eccentric angle, in radians.
     * @param xAxisRotation - The angle of the whole ellipse w.r.t. x-axis.
     * @param anticlockwise - Specifies whether the drawing should be counterclockwise or clockwise.
     * @return This Graphics object. Good for chaining method calls.
     */
    ellipticArc(
        cx,
        cy,
        rx,
        ry,
        startAngle,
        endAngle,
        xAxisRotation = 0,
        anticlockwise = false)
    {
        const sweepAngle = endAngle - startAngle;
        const n = GRAPHICS_CURVES.adaptive
            ? _segmentsCount(EllipticArcUtils.calculateArcLength(rx, ry, startAngle, endAngle - startAngle)) * 4
            : 20;
        const delta = (anticlockwise ? -1 : 1) * Math.abs(sweepAngle) / (n - 1);

        tempMatrix$2.identity()
            .translate(-cx, -cy)
            .rotate(xAxisRotation)
            .translate(cx, cy);

        for (let i = 0; i < n; i++)
        {
            const eccentricAngle = startAngle + (i * delta);
            const xr = cx + (rx * Math.cos(eccentricAngle));
            const yr = cy + (ry * Math.sin(eccentricAngle));

            const { x, y } = xAxisRotation !== 0 ? tempMatrix$2.apply({ x: xr, y: yr }) : { x: xr, y: yr };

            if (i === 0)
            {
                this._initCurve(x, y);
                continue;
            }

            this.currentPath.points.push(x, y);
        }

        return this;
    }

    /**
     * Draws an elliptical arc to the specified point.
     *
     * If rx = 0 or ry = 0, then a line is drawn. If the radii provided are too small to draw the arc, then
     * they are scaled up appropriately.
     *
     * @param endX - the x-coordinate of the ending point.
     * @param endY - the y-coordinate of the ending point.
     * @param rx - The radius along the x-axis.
     * @param ry - The radius along the y-axis.
     * @param xAxisRotation - The angle of the ellipse as a whole w.r.t/ x-axis.
     * @param anticlockwise - Specifies whether the arc should be drawn counterclockwise or clockwise.
     * @param largeArc - Specifies whether the larger arc of two possible should be choosen.
     * @return This Graphics object. Good for chaining method calls.
     * @see https://svgwg.org/svg2-draft/paths.html#PathDataEllipticalArcCommands
     * @see https://www.w3.org/TR/SVG2/implnote.html#ArcImplementationNotes
     */
    ellipticArcTo(
        endX,
        endY,
        rx,
        ry,
        xAxisRotation = 0,
        anticlockwise = false,
        largeArc = false,
    )
    {
        if (rx === 0 || ry === 0)
        {
            return this.lineTo(endX, endY) ;
        }

        // See https://www.w3.org/TR/SVG2/implnote.html#ArcImplementationNotes
        const points = this.currentPath.points;
        const startX = points[points.length - 2];
        const startY = points[points.length - 1];
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        // Transform into a rotated frame with the origin at the midpoint.
        const matrix = tempMatrix$2
            .identity()
            .translate(-midX, -midY)
            .rotate(-xAxisRotation);
        const { x: xRotated, y: yRotated } = matrix.apply({ x: startX, y: startY });

        const a = Math.pow(xRotated / rx, 2) + Math.pow(yRotated / ry, 2);

        if (a > 1)
        {
            // Ensure radii are large enough to connect start to end point.
            rx = Math.sqrt(a) * rx;
            ry = Math.sqrt(a) * ry;
        }

        const rx2 = rx * rx;
        const ry2 = ry * ry;

        // Calculate the center of the ellipse in this rotated space.
        // See implementation notes for the equations: https://svgwg.org/svg2-draft/implnote.html#ArcImplementationNotes
        const sgn = (anticlockwise === largeArc) ? 1 : -1;
        const coef = sgn * Math.sqrt(
            // use Math.abs to prevent numerical imprecision from creating very small -ve
            // values (which should be zero instead). Otherwise, NaNs are possible
            Math.abs((rx2 * ry2) - (rx2 * yRotated * yRotated) - (ry2 * xRotated * xRotated))
            / ((rx2 * yRotated * yRotated) + (ry2 * xRotated * xRotated)),
        );
        const cxRotated = coef * (rx * yRotated / ry);
        const cyRotated = -coef * (ry * xRotated / rx);

        // Calculate the center of the ellipse back in local space.
        const { x: cx, y: cy } = matrix.applyInverse({ x: cxRotated, y: cyRotated });

        // Calculate startAngle
        const x1Norm = (xRotated - cxRotated) / rx;
        const y1Norm = (yRotated - cyRotated) / ry;
        const dist1Norm = Math.sqrt((x1Norm ** 2) + (y1Norm ** 2));
        const startAngle = (y1Norm >= 0 ? 1 : -1) * Math.acos(x1Norm / dist1Norm);

        // Calculate endAngle
        const x2Norm = (-xRotated - cxRotated) / rx;
        const y2Norm = (-yRotated - cyRotated) / ry;
        const dist2Norm = Math.sqrt((x2Norm ** 2) + (y2Norm ** 2));
        let endAngle = (y2Norm >= 0 ? 1 : -1) * Math.acos(x2Norm / dist2Norm);

        // Ensure endAngle is on the correct side of startAngle
        if (endAngle > startAngle && anticlockwise)
        {
            endAngle -= Math.PI * 2;
        }
        else if (startAngle > endAngle && !anticlockwise)
        {
            endAngle += Math.PI * 2;
        }

        // Draw the ellipse!
        this.ellipticArc(
            cx, cy,
            rx, ry,
            startAngle,
            endAngle,
            xAxisRotation,
            anticlockwise,
        );

        return this;
    }

    /**
     * Embeds the `SVGCircleElement` into this node.
     *
     * @param element - The circle element to draw.
     */
    embedCircle(element)
    {
        element.cx.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.cy.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.r.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);

        const cx = element.cx.baseVal.valueInSpecifiedUnits;
        const cy = element.cy.baseVal.valueInSpecifiedUnits;
        const r = element.r.baseVal.valueInSpecifiedUnits;

        this.drawCircle(cx, cy, r);
    }

    /**
     * Embeds the `SVGEllipseElement` into this node.
     *
     * @param element - The ellipse element to draw.
     */
    embedEllipse(element)
    {
        element.cx.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.cy.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.rx.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.ry.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);

        const cx = element.cx.baseVal.valueInSpecifiedUnits;
        const cy = element.cy.baseVal.valueInSpecifiedUnits;
        const rx = element.rx.baseVal.valueInSpecifiedUnits;
        const ry = element.ry.baseVal.valueInSpecifiedUnits;

        this.ellipticArc(
            cx,
            cy,
            rx,
            ry,
            0,
            2 * Math.PI,
        );
    }

    /**
     * Embeds the `SVGLineElement` into this node.
     *
     * @param element - The line element to draw.
     */
    embedLine(element)
    {
        element.x1.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.y1.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.x2.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.y2.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);

        const x1 = element.x1.baseVal.valueInSpecifiedUnits;
        const y1 = element.y1.baseVal.valueInSpecifiedUnits;
        const x2 = element.x2.baseVal.valueInSpecifiedUnits;
        const y2 = element.y2.baseVal.valueInSpecifiedUnits;

        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
    }

    /**
     * Embeds the `SVGRectElement` into this node.
     *
     * @param element - The rectangle element to draw.
     */
    embedRect(element)
    {
        element.x.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.y.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.width.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.height.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.rx.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.ry.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);

        const x = element.x.baseVal.valueInSpecifiedUnits;
        const y = element.y.baseVal.valueInSpecifiedUnits;
        const width = element.width.baseVal.valueInSpecifiedUnits;
        const height = element.height.baseVal.valueInSpecifiedUnits;
        const rx = element.rx.baseVal.valueInSpecifiedUnits;
        const ry = element.ry.baseVal.valueInSpecifiedUnits || rx;

        if (rx === 0 || ry === 0)
        {
            this.drawRect(x, y, width, height);
        }
        else
        {
            this.moveTo(x, y + ry);
            this.ellipticArcTo(x + rx, y, rx, ry, 0, false, false);
            this.lineTo(x + width - rx, y);
            this.ellipticArcTo(x + width, y + ry, rx, ry, 0, false, false);
            this.lineTo(x + width, y + height - ry);
            this.ellipticArcTo(x + width - rx, y + height, rx, ry, 0, false, false);
            this.lineTo(x + rx, y + height);
            this.ellipticArcTo(x, y + height - ry, rx, ry, 0, false, false);
            this.closePath();
        }
    }

    /**
     * Embeds the `SVGPolygonElement` element into this node.
     *
     * @param element - The polygon element to draw.
     */
    embedPolygon(element)
    {
        const points = element.getAttribute('points')
            .split(/[ ,]/g)
            .map((p) => parseInt(p, 10));

        this.moveTo(points[0], points[1]);

        for (let i = 2; i < points.length; i += 2)
        {
            this.lineTo(points[i], points[i + 1]);
        }

        this.closePath();
    }

    /**
     * Embeds the `SVGPolylineElement` element into this node.
     *
     * @param element - The polyline element to draw.
     */
    embedPolyline(element)
    {
        const points = element.getAttribute('points')
            .split(/[ ,]/g)
            .map((p) => parseInt(p, 10));

        this.moveTo(points[0], points[1]);

        for (let i = 2; i < points.length; i += 2)
        {
            this.lineTo(points[i], points[i + 1]);
        }
    }

    /**
     * @override
     */
    render(renderer)
    {
        const paintServers = this.paintServers;

        // Ensure paint servers are updated
        for (let i = 0, j = paintServers.length; i < j; i++)
        {
            paintServers[i].resolvePaint(renderer);
        }

        super.render(renderer);
    }
}

function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
const tempMatrix$1 = new Matrix();

/**
 * Draws SVG &lt;image /&gt; elements.
 * 
 * @public
 */
class SVGImageNode extends SVGGraphicsNode
{
    /**
     * The canvas used into which the `SVGImageElement` is drawn. This is because WebGL does not support
     * using `SVGImageElement` as an `ImageSource` for textures.
     */
    

    /**
     * The Canvas 2D context for `this._canvas`.
     */
    

    /**
     * A texture backed by `this._canvas`.
     */
    

    /**
     * Embeds the given SVG image element into this node.
     *
     * @param element - The SVG image element to embed.
     */
    embedImage(element)
    {
        element.x.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.y.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.width.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.height.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);

        // Image frame
        const x = element.x.baseVal.valueInSpecifiedUnits;
        const y = element.y.baseVal.valueInSpecifiedUnits;
        const width = element.width.baseVal.valueInSpecifiedUnits;
        const height = element.height.baseVal.valueInSpecifiedUnits;
        const opacity = Number.parseFloat(element.getAttribute('opacity') || '1');

        // Calculate scale. If the <image /> element is scaled down, then the texture can be rendered at a lower
        // resolution to save graphics memory.
        const transform = element instanceof SVGGraphicsElement ? element.transform.baseVal.consolidate() : null;
        const transformMatrix = transform ? transform.matrix : tempMatrix$1.identity();
        const { a, b, c, d } = transformMatrix;
        const sx = Math.min(1, Math.sqrt((a * a) + (b * b)));
        const sy = Math.min(1, Math.sqrt((c * c) + (d * d)));
        const twidth = Math.ceil(width * sx);
        const theight = Math.ceil(height * sy);

        // Initialize the texture & canvas
        this.initTexture(twidth, theight);

        // Load the image element
        /* eslint-disable-next-line no-undef */
        const baseURL = _optionalChain$1([globalThis, 'optionalAccess', _ => _.location, 'access', _2 => _2.href]);
        const imageURL = element.getAttribute('href') || element.getAttribute('xlink:href');
        const imageOrigin = new URL(imageURL).origin;
        let imageElement = element;

        if (imageOrigin && imageOrigin !== baseURL)
        {
            imageElement = document.createElement('img');
            imageElement.crossOrigin = 'anonymous';
            imageElement.src = imageURL;
        }

        // Draw the image when it loads
        imageElement.onload = () =>
        {
            this.drawTexture(imageElement);
        };

        // Generate the quad geometry
        this.beginTextureFill({
            texture: this._texture,
            alpha: opacity,
            matrix: new Matrix()
                .scale(1 / sx, 1 / sy),
        });
        this.drawRect(x, y, width, height);
        this.endFill();
    }

    /**
     * Initializes {@code this._texture} by allocating it from the atlas. It is expected the texture size requested
     * is less than the atlas's slab dimensions.
     *
     * @param width
     * @param height
     */
     initTexture(width, height)
    {
        // If the texture already exists, nothing much to do.
        if (this._texture)
        {
            if (this._texture.width <= this.context.atlas.maxWidth
                && this._texture.height <= this.context.atlas.maxHeight)
            {
                this.context.atlas.free(this._texture);
            }
            else
            {
                // TODO: This does destroy it, right?
                this._texture.destroy();
            }
        }

        this._texture = null;
        this._texture = this.context.atlas.allocate(width, height);

        if (this._texture)
        {
            this._canvas = (this._texture.baseTexture.resource ).source ;
            this._context = this._canvas.getContext('2d');
        }
        else // Allocation fails if the texture is too large. If so, create a standalone texture.
        {
            this._canvas = document.createElement('canvas');

            this._canvas.width = width;
            this._canvas.height = height;

            this._context = this._canvas.getContext('2d');
            this._texture = Texture.from(this._canvas);
        }
    }

    /**
     * Draws the image into this node's texture.
     *
     * @param image - The image element holding the image.
     */
     drawTexture(image)
    {
        const destinationFrame = this._texture.frame;

        this._context.clearRect(
            destinationFrame.x,
            destinationFrame.y,
            destinationFrame.width,
            destinationFrame.height,
        );

        this._context.drawImage(
            image,
            destinationFrame.x,
            destinationFrame.y,
            destinationFrame.width,
            destinationFrame.height,
        );

        this._texture.update();
    }
}

// Not used yet, tess2 isn't so good.
const buildPath = {
    build()
    {
        /* This method is intentionally blank. */
    },
    triangulate(graphicsData, graphicsGeometry)
    {
        try
        {
            const path = graphicsData.shape ;
            const contours = path.contours
                .filter((c) => c.length > 0)
                .filter((c) => (c.find((e) => isNaN(e)) === undefined));

            const tessy = new libtess.GluTesselator();
            const outVerts = [];

            /* eslint-disable no-inner-declarations, @typescript-eslint/no-unused-vars */
            function vertexCallback(data, polyVertArray)
            {
                // console.log(data[0], data[1]);
                polyVertArray[polyVertArray.length] = data[0];
                polyVertArray[polyVertArray.length] = data[1];
            }
            function begincallback(type)
            {
                if (type !== libtess.primitiveType.GL_TRIANGLES) {
                    console.warn(`expected TRIANGLES but got type: ${type}`);
                }
            }
            function errorcallback(errno)
            {
                console.error('error callback');
                console.error(`error number: ${errno}`);
            }
            // callback for when segments intersect and must be split
            function combinecallback(coords, _data, _weight)
            {
                // console.log('combine callback');
                return [coords[0], coords[1], coords[2]];
            }
            function edgeCallback(_flag)
            {
                // don't really care about the flag, but need no-strip/no-fan behavior
                // console.log('edge flag: ' + flag);
            }
            /* eslint-enable no-inner-declarations */

            tessy.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE,
                path.fillRule === FILL_RULE.EVENODD
                    ? libtess.windingRule.GLU_TESS_WINDING_ODD
                    : libtess.windingRule.GLU_TESS_WINDING_NONZERO);
            tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
            tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback);
            tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback);
            tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback);
            tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);

            tessy.gluTessNormal(0, 0, 1);
            tessy.gluTessBeginPolygon(outVerts);

            for (let i = 0; i < contours.length; i++)
            {
                const contour = contours[i];

                tessy.gluTessBeginContour();

                for (let j = 0; j < contour.length;)
                {
                    const x = contour[j++];
                    const y = contour[j++];
                    const data = [x, y, 0];

                    tessy.gluTessVertex(data, data);
                }

                tessy.gluTessEndContour();
            }

            tessy.gluTessEndPolygon();

            const verts = graphicsGeometry.points;
            const indices = graphicsGeometry.indices;
            const ibase = verts.length / 2;

            for (let i = 0; i < outVerts.length;)
            {
                verts.push(outVerts[i++], outVerts[i++]);
            }
            for (let i = 0; i < outVerts.length / 2; i++)
            {
                indices.push(i + ibase);
            }
        }
        catch (e)
        {
            console.error(e);
        }
    },
};

function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
graphicsUtils.FILL_COMMANDS[PATH] = buildPath;

/**
 * Draws SVG &lt;path /&gt; elements.
 * 
 * @public
 */
class SVGPathNode extends SVGGraphicsNode
{constructor(...args) { super(...args); SVGPathNode.prototype.__init.call(this);SVGPathNode.prototype.__init2.call(this); }
    

     startPath()
    {
        if (this.currentPath2)
        {
            const pts = this.currentPath2.points;

            if (pts.length > 0)
            {
                this.currentPath2.closeContour();
            }
        }
        else
        {
            this.currentPath2 = new Path();
        }
    }

     finishPath()
    {
        if (this.currentPath2)
        {
            this.currentPath2.closeContour();
        }
    }

    // @ts-expect-error
    get currentPath()
    {
        return this.currentPath2;
    }
    set currentPath(nothing)
    {
        if (nothing)
        {
            throw new Error('currentPath cannot be set');
        }
        // readonly
    }

    closePath()
    {
        this.currentPath2.points.push(this.currentPath2.points[0], this.currentPath2.points[1]);
        this.finishPath();

        return this;
    }

    checkPath()
    {
        if (this.currentPath2.points.find((e) => isNaN(e)) !== undefined)
        {
            throw new Error('NaN is bad');
        }
    }

    // Redirect moveTo, lineTo, ... onto paths!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! :P
    __init() {this.startPoly = this.startPath;}
    __init2() {this.finishPoly = this.finishPath;}

    /**
     * Embeds the `SVGPathElement` into this node.
     *
     * @param element - the path to draw
     */
    embedPath(element)
    {
        const d = element.getAttribute('d');

        // Parse path commands using d-path-parser. This is an inefficient solution that causes excess memory allocation
        // and should be optimized in the future.
        const commands = dPathParser(d.trim());

        // Current point
        let x = 0;
        let y = 0;

        for (let i = 0, j = commands.length; i < j; i++)
        {
            const lastCommand = commands[i - 1];
            const command = commands[i];

            if (isNaN(x) || isNaN(y))
            {
                throw new Error('Data corruption');
            }

            // Taken from: https://github.com/bigtimebuddy/pixi-svg/blob/main/src/SVG.js
            // Copyright Matt Karl
            switch (command.code)
            {
                case 'm': {
                    this.moveTo(
                        x += command.end.x,
                        y += command.end.y,
                    );
                    break;
                }
                case 'M': {
                    this.moveTo(
                        x = command.end.x,
                        y = command.end.y,
                    );
                    break;
                }
                case 'H': {
                    this.lineTo(x = command.value, y);
                    break;
                }
                case 'h': {
                    this.lineTo(x += command.value, y);
                    break;
                }
                case 'V': {
                    this.lineTo(x, y = command.value);
                    break;
                }
                case 'v': {
                    this.lineTo(x, y += command.value);
                    break;
                }
                case 'z':
                case 'Z': {
                    x = _optionalChain([this, 'access', _ => _.currentPath2, 'optionalAccess', _2 => _2.points, 'access', _3 => _3[0]]) || 0;
                    y = _optionalChain([this, 'access', _4 => _4.currentPath2, 'optionalAccess', _5 => _5.points, 'access', _6 => _6[1]]) || 0;
                    this.closePath();
                    break;
                }
                case 'L': {
                    this.lineTo(
                        x = command.end.x,
                        y = command.end.y,
                    );
                    break;
                }
                case 'l': {
                    this.lineTo(
                        x += command.end.x,
                        y += command.end.y,
                    );
                    break;
                }
                case 'C': {
                    this.bezierCurveTo(
                        command.cp1.x,
                        command.cp1.y,
                        command.cp2.x,
                        command.cp2.y,
                        x = command.end.x,
                        y = command.end.y,
                    );
                    break;
                }
                case 'c': {
                    const currX = x;
                    const currY = y;

                    this.bezierCurveTo(
                        currX + command.cp1.x,
                        currY + command.cp1.y,
                        currX + command.cp2.x,
                        currY + command.cp2.y,
                        x += command.end.x,
                        y += command.end.y,
                    );
                    break;
                }
                case 's':
                case 'S': {
                    const cp1 = { x, y };
                    const lastCode = commands[i - 1] ? commands[i - 1].code : null;

                    if (i > 0 && (lastCode === 's' || lastCode === 'S' || lastCode === 'c' || lastCode === 'C'))
                    {
                        const lastCommand = commands[i - 1];
                        const lastCp2 = { ...(lastCommand.cp2 || lastCommand.cp) };

                        if (commands[i - 1].relative)
                        {
                            lastCp2.x += (x - lastCommand.end.x);
                            lastCp2.y += (y - lastCommand.end.y);
                        }

                        cp1.x = (2 * x) - lastCp2.x;
                        cp1.y = (2 * y) - lastCp2.y;
                    }

                    const cp2 = { x: command.cp.x , y: command.cp.y };

                    if (command.relative)
                    {
                        cp2.x += x;
                        cp2.y += y;

                        x += command.end.x;
                        y += command.end.y;
                    }
                    else
                    {
                        x = command.end.x;
                        y = command.end.y;
                    }

                    this.bezierCurveTo(
                        cp1.x,
                        cp1.y,
                        cp2.x,
                        cp2.y,
                        x,
                        y,
                    );

                    break;
                }
                case 'q': {
                    const currX = x;
                    const currY = y;

                    this.quadraticCurveTo(
                        currX + command.cp.x,
                        currY + command.cp.y,
                        x += command.end.x,
                        y += command.end.y,
                    );
                    break;
                }
                case 'Q': {
                    this.quadraticCurveTo(
                        command.cp.x,
                        command.cp.y,
                        x = command.end.x,
                        y = command.end.y,
                    );
                    break;
                }
                case 'A':
                    this.ellipticArcTo(
                        x = command.end.x,
                        y = command.end.y,
                        command.radii.x,
                        command.radii.y,
                        (command.rotation || 0) * Math.PI / 180,
                        !command.clockwise,
                        command.large,
                    );
                    break;
                case 'a':
                    this.ellipticArcTo(
                        x += command.end.x,
                        y += command.end.y,
                        command.radii.x,
                        command.radii.y,
                        (command.rotation || 0) * Math.PI / 180,
                        !command.clockwise,
                        command.large,
                    );

                    break;
                case 't':
                case 'T': {
                    let cx;
                    let cy;

                    if (lastCommand && lastCommand.cp)
                    {
                        let lcx = lastCommand.cp.x;
                        let lcy = lastCommand.cp.y;

                        if (lastCommand.relative)
                        {
                            const lx = x - lastCommand.end.x;
                            const ly = y - lastCommand.end.y;

                            lcx += lx;
                            lcy += ly;
                        }

                        cx = (2 * x) - lcx;
                        cy = (2 * y) - lcy;
                    }
                    else
                    {
                        cx = x;
                        cy = y;
                    }

                    if (command.code === 't')
                    {
                        this.quadraticCurveTo(
                            cx,
                            cy,
                            x += command.end.x,
                            y += command.end.y,
                        );
                    }
                    else
                    {
                        this.quadraticCurveTo(
                            cx,
                            cy,
                            x = command.end.x,
                            y = command.end.y,
                        );
                    }

                    break;
                }
                default: {
                    console.warn('[PIXI.SVG] Draw command not supported:', command.code, command);
                    break;
                }
            }
        }

        if (this.currentPath2)
        {
            this.currentPath2.fillRule = element.getAttribute('fill-rule')  || this.currentPath2.fillRule;
            this.drawShape(this.currentPath2 );
            this.currentPath2 = null;
        }

        return this;
    }
}

/**
 * The luminance-to-red filter stores the luminance of the RGB components into the alpha channel
 * of the texture.
 *
 * @ignore
 */
const l2rFilter = new ColorMatrixFilter();

l2rFilter.matrix = [
    0.33, 0.33, 0.33, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0.33, 0.33, 0.33, 0, 0,
];

const tempSourceFrame = new Rectangle();
const tempDestinationFrame = new Rectangle();

/**
 * A sprite that does not render anything. It can be used as a mask whose bounds can be updated by adding it
 * as a child of the mask-target.
 *
 * @public
 * @see MaskServer.createMask
 * @ignore
 */
class MaskSprite extends Sprite
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(_)
    {
        // NOTHING
    }
}

/**
 * A `MaskServer` will lazily render its content's luminance into its render-texture's alpha
 * channel using the luminance-alpha filter. The `dirtyId` flag can be used to make it re-render its
 * contents. It is intended to be used as a sprite-mask, where black pixels are invisible and white
 * pixels are visible (i.e. black pixels are filtered to alpha = 0, while white pixels are filtered
 * to alpha = 1. The rest are filtered to an alpha such that 0 < alpha < 1.). This is in compliance
 * with [CSS Masking Module Level 1](https://www.w3.org/TR/css-masking-1/#MaskElement).
 *
 * @public
 * @ignore
 */
class MaskServer extends Sprite
{
    /**
     * Flags when re-renders are required due to content updates.
     */
    

    /**
     * Flags when the content is re-rendered and should be equal to `this.dirtyId` when the texture
     * is update-to-date.
     */
    

    /**
     * @param texture - The render-texture that will cache the contents.
     */
    constructor(texture)
    {
        super(texture);

        this.dirtyId = 0;
        this.updateId = -1;
    }

    /**
     * @override
     */
    render(renderer)
    {
        if (this.dirtyId !== this.updateId)
        {
            // Update texture resolution, without changing screen-space resolution
            this.texture.baseTexture.setSize(this.texture.width, this.texture.height, renderer.resolution);

            renderer.batch.flush();

            const renderTarget = renderer.renderTexture.current;
            const sourceFrame = tempSourceFrame.copyFrom(renderer.renderTexture.sourceFrame);
            const destinationFrame = tempDestinationFrame.copyFrom(renderer.renderTexture.destinationFrame);

            const localBounds = (this ).getLocalBounds(null);
            const children = this.children;

            renderer.renderTexture.bind(this.texture , localBounds);
            renderer.renderTexture.clear();
            renderer.filter.push({ filterArea: localBounds, getBounds: () => localBounds }, [l2rFilter]);

            for (let i = 0, j = children.length; i < j; i++)
            {
                const child = children[i];

                child.enableTempParent();
                child.updateTransform();
                (children[i] ).render(renderer);
                child.disableTempParent(this);
            }

            renderer.batch.flush();
            renderer.filter.pop();

            renderer.renderTexture.bind(renderTarget, sourceFrame, destinationFrame);

            this.updateId = this.dirtyId;

            this.getBounds();
        }
    }

    /**
     * Create a mask that will overlay on top of the given display-object using the texture of this
     * mask server.
     *
     * @param displayObject - The mask target.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createMask(_)
    {
        return new MaskSprite(this.texture);
    }
}

const NODE_TRANSFORM_DIRTY = 'nodetransformdirty';
const TRANSFORM_DIRTY = 'transformdirty';

/**
 * `SVGTextEngineImpl` is the default implementation for {@link SVGTextEngine}. It is inspired by {@link PIXI.Text} that
 * is provided by @pixi/text. It uses a &lt;canvas /&gt; to draw and cache the text. This may cause blurring issues when
 * the SVG is viewed at highly zoomed-in scales because it is rasterized.
 *
 * @public
 */
class SVGTextEngineImpl extends Sprite 
{
    
    
    






    
    

    constructor()
    {
        super(Texture.EMPTY);

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.texture = Texture.from(this.canvas);

        this.contentList = new Map();

        this.dirtyId = 0;
        this.updateId = 0;
    }

    async clear()
    {
        this.contentList.clear();
        this.dirtyId++;
        this.position.set(0, 0);
    }

    async put(
        id,
        position,
        content,
        style,
        matrix,
    )
    {
        this.contentList.set(id, {
            position,
            content,
            style,
            matrix,
        });

        const textMetrics = TextMetrics.measureText(content, new TextStyle(style), false, this.canvas);

        this.dirtyId++;

        return {
            x: position.x + textMetrics.width,
            y: position.y,
        };
    }

    updateText()
    {
        let w = 0;
        let h = 0;

        this.contentList.forEach(({ position, content, style }) =>
        {
            const textMetrics = TextMetrics.measureText(content, new TextStyle(style), false, this.canvas);

            w = Math.max(w, position.x + textMetrics.width);
            h = Math.max(h, position.y + textMetrics.height + textMetrics.fontProperties.descent);
        });

        const resolution = window.devicePixelRatio || 1;

        this.canvas.width = w * resolution;
        this.canvas.height = h * resolution;
        this.texture.baseTexture.setRealSize(w, h, resolution);
        this.texture.update();

        this.context.clearRect(0, 0, w * resolution, h * resolution);
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.scale(resolution, resolution);

        let i = 0;

        for (const [_, { position, content, style }] of this.contentList)
        {
            const textMetrics = TextMetrics.measureText(content, new TextStyle(style), false, this.canvas);
            const textStyle = new TextStyle(style);

            this.context.fillStyle = typeof textStyle.fill === 'string' ? textStyle.fill : 'black';
            this.context.font = textStyle.toFontString();

            this.context.fillText(content, position.x, position.y + textMetrics.height);

            if (i === 0)
            {
                this.y -= textMetrics.height;
            }

            i++;
        }

        this.updateId = this.dirtyId;

        // Ensure the SVG scene updates its bounds after the text is rendered.
        this.emit(NODE_TRANSFORM_DIRTY);
     }

    render(renderer)
    {
        if (this.updateId !== this.dirtyId)
        {
            this.updateText();
            this.updateTransform();
        }

        super.render(renderer);
    }
}

/**
 * Parses font measurements, e.g. '14px', '.5em'
 * @ignore
 */
function parseMeasurement(mes, fontSize = 16)
{
    if (!mes)
    {
        return 0;
    }

    // TODO: Handle non-px/em units

    // Handle em
    if (mes.includes('em'))
    {
        return parseFloat(mes) * fontSize;
    }

    return parseFloat(mes);
}

/**
 * Draws SVG &lt;text /&gt; elements.
 *
 * @public
 */
class SVGTextNode extends Container
{
    /**
     * The SVG text rendering engine to be used by default in `SVGTextNode`. This API is not stable and
     * can change anytime.
     *
     * @alpha
     */
    static __initStatic() {this.defaultEngine = SVGTextEngineImpl;}

    /**
     * An instance of a SVG text engine used to layout and render text.
     */
    

    /**
     * The current text position, where the next glyph will be placed.
     */
    

    constructor()
    {
        super();

        this.currentTextPosition = { x: 0, y: 0 };
        this.engine = new (SVGTextNode.defaultEngine)();
        this.addChild(this.engine);

        // Listen to nodetransformdirty on the engine so bounds are updated
        // when the text is rendered.
        this.engine.on(NODE_TRANSFORM_DIRTY, () => {
            this.emit(NODE_TRANSFORM_DIRTY);
        });
    }

    /**
     * Embeds a `SVGTextElement` in this node.
     *
     * @param {SVGTextElement} element - The `SVGTextElement` to embed.
     */
    async embedText(element, style = {})
    {
        const engine = this.engine;

        if (element instanceof SVGTextElement)
        {
            await engine.clear();

            this.currentTextPosition.x = element.x.baseVal.length > 0
                ? element.x.baseVal.getItem(0).value
                : 0;
            this.currentTextPosition.y = element.y.baseVal.length > 0
                ? element.y.baseVal.getItem(0).value
                : 0;
        }

        const fill = element.getAttribute('fill');
        const fontFamily = element.getAttribute('font-family');
        const fontSize = parseFloat(element.getAttribute('font-size'));
        const fontWeight = element.getAttribute('font-weight');
        const letterSpacing = parseMeasurement(element.getAttribute('letter-spacing'), fontSize);

        style.fill = fill || style.fill || 'black';
        style.fontFamily = fontFamily || !style.fontFamily ? `${fontFamily || 'serif'}, serif` : style.fontFamily;
        style.fontSize = !isNaN(fontSize) ? fontSize : style.fontSize;
        style.fontWeight = (fontWeight ) || style.fontWeight || 'normal';
        style.letterSpacing = !isNaN(letterSpacing) ? letterSpacing : (style.letterSpacing || 0);
        style.wordWrap = true;
        style.wordWrapWidth = 400;

        const childNodes = element.childNodes;

        for (let i = 0, j = childNodes.length; i < j; i++)
        {
            const childNode = childNodes.item(i);

            let textContent;
            let textStyle;

            /* eslint-disable-next-line no-undef */
            if (childNode instanceof globalThis.Text)
            {
                textContent = childNode.data;
                textStyle = style;

                this.currentTextPosition = await engine.put(
                    childNode,
                    {
                        x: this.currentTextPosition.x,
                        y: this.currentTextPosition.y,
                    },
                    textContent,
                    textStyle,
                );

                // Ensure transforms are updated as new text phrases are loaded.
                this.emit(NODE_TRANSFORM_DIRTY);
            }
            else if (childNode instanceof SVGTSpanElement)
            {
                if (childNode.x.baseVal.length > 0)
                {
                    this.currentTextPosition.x = childNode.x.baseVal.getItem(0).value;
                }
                if (childNode.y.baseVal.length > 0)
                {
                    this.currentTextPosition.y = childNode.y.baseVal.getItem(0).value;
                }

                await this.embedText(childNode, { ...style });
            }
        }
    }
} SVGTextNode.__initStatic();

/**
 * Container for rendering SVG &lt;use /&gt; elements.
 * 
 * @public
 */
class SVGUseNode extends Container
{constructor(...args) { super(...args); SVGUseNode.prototype.__init.call(this); }
     __init() {this.isRefExternal = false;}

    

    /**
     * Embeds the `SVGUseElement` into this node.
     *
     * @param element - The &lt;use /&gt; element to draw.
     */
    embedUse(element)
    {
        element.x.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.y.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.width.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
        element.height.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);

        const x = element.x.baseVal.valueInSpecifiedUnits;
        const y = element.y.baseVal.valueInSpecifiedUnits;

        // TODO: width,height only have an efffect if the reference element is <svg> or <symbol>.
        // const width = element.width.baseVal.valueInSpecifiedUnits;
        // const height = element.height.baseVal.valueInSpecifiedUnits;

        this.position.set(x, y);
    }

    /**
     * The node that renders the element referenced by a &lt;element /&gt; element.
     */
    get ref()
    {
        return this._ref;
    }
    set ref(value)
    {
        if (this._ref)
        {
            if (this._ref === value)
            {
                return;
            }

            this.removeChild(this._ref);
        }

        this._ref = value;
        this.addChild(this._ref);
    }
}

const tempMatrix = new Matrix();
const tempRect = new Rectangle();

/**
 * {@link SVGScene} can be used to build an interactive viewer for scalable vector graphics images. You must specify the size
 * of the svg viewer.
 *
 * ## SVG Scene Graph
 *
 * SVGScene has an internal, disconnected scene graph that is optimized for lazy updates. It will listen to the following
 * events fired by a node:
 *
 * * `nodetransformdirty`: This will invalidate the transform calculations.
 *
 * @public
 */
class SVGScene extends DisplayObject
{
    /**
     * The SVG image content being rendered by the scene.
     */
    

    /**
     * The root display object of the scene.
     */
    

    /**
     * Display objects that don't render to the screen, but are required to update before the rendering
     * nodes, e.g. mask sprites.
     */
    

    /**
     * The scene context
     */
    

    /**
     * The width of the rendered scene in local space.
     */
    

    /**
     * The height of the rendered scene in local space.
     */
    

    /**
     * This is used to cull the SVG scene graph before rendering.
     */
    

    /**
     * Maps content elements to their paint. These paints do not inherit from their parent element. You must
     * compose an {@link InheritedPaintProvider} manually.
     */
    

    /**
     * Maps `SVGMaskElement` elements to their nodes. These are not added to the scene graph directly and are
     * only referenced as a `mask`.
     */
    

    /**
     * Flags whether any transform is dirty in the SVG scene graph.
     */
    

    __init() {this.sortDirty = false;}

    /**
     * @param content - The SVG node to render
     * @param context - This can be used to configure the scene
     */
    constructor(content, context)
    {
        super();SVGScene.prototype.__init.call(this);SVGScene.prototype.__init2.call(this);
        this.content = content;

        this.initContext(context);
        this._width = content.viewBox.baseVal.width;
        this._height = content.viewBox.baseVal.height;

        this._cull = new Cull({ recursive: true, toggle: 'renderable' });
        this._elementToPaint = new Map();
        this._elementToMask = new Map();
        this._transformDirty = true;

        this.renderServers = new Container();

        if (!context || !context.disableRootPopulation)
            this.populateScene();
    }

    initContext(context)
    {
        context = context || {};
        context.atlas = context.atlas || new CanvasTextureAllocator(2048, 2048);
        context.disableHrefSVGLoading = typeof context.disableHrefSVGLoading === 'undefined'
            ? false : context.disableHrefSVGLoading;

        this._context = context ;
    }

    /**
     * Calculates the bounds of this scene, which is defined by the set `width` and `height`. The contents
     * of this scene are scaled to fit these bounds, and don't affect them whatsoever.
     *
     * @override
     */
    calculateBounds()
    {
        this._bounds.clear();
        this._bounds.addFrameMatrix(
            this.worldTransform,
            0,
            0,
            this.content.viewBox.baseVal.width,
            this.content.viewBox.baseVal.height,
        );
    }

    removeChild()
    {
        // Just to implement DisplayObject
    }

    /**
     * @override
     */
    destroy() {
        this.root.destroy(true);

        super.destroy();
    }

    /**
     * @override
     */
    render(renderer)
    {
        if (!this.visible || !this.renderable)
        {
            return;
        }

        // Update render-server objects
        this.renderServers.render(renderer);

        // Cull the SVG scene graph
        this._cull.cull(renderer.renderTexture.sourceFrame, true);

        // Render the SVG scene graph
        this.root.render(renderer);

        // Uncull the SVG scene graph. This ensures the scene graph is fully 'renderable'
        // outside of a render cycle.
        this._cull.uncull();
    }

    /**
     * @override
     */
    updateTransform()
    {
        super.updateTransform();

        this.root.alpha = this.worldAlpha;

        const worldTransform = this.worldTransform;
        const rootTransform = this.root.transform.worldTransform;

        // Don't update transforms if they didn't change across frames. This is because the SVG scene graph is static.
        if (rootTransform.a === worldTransform.a
            && rootTransform.b === worldTransform.b
            && rootTransform.c === worldTransform.c
            && rootTransform.d === worldTransform.d
            && rootTransform.tx === worldTransform.tx
            && rootTransform.ty === worldTransform.ty
            && (rootTransform )._worldID !== 0
            && !this._transformDirty)
        {
            return;
        }

        this.root.enableTempParent();
        this.root.transform.setFromMatrix(this.worldTransform);
        this.root.updateTransform();
        this.root.disableTempParent(null);

        // Calculate bounds in the SVG scene graph. This ensures they are updated whenever the transform changes.
        this.root.calculateBounds();

        // Prevent redundant recalculations.
        this._transformDirty = false;
    }

    /**
     * Creates a display object that implements the corresponding `embed*` method for the given node.
     *
     * @param element - The element to be embedded in a display object.
     */
     createNode(element)
    {
        let renderNode = null;

        switch (element.nodeName.toLowerCase())
        {
            case 'circle':
            case 'ellipse':
            case 'g':
            case 'line':
            case 'polyline':
            case 'polygon':
            case 'rect':
                renderNode = new SVGGraphicsNode(this._context);
                break;
            case 'image':
                renderNode = new SVGImageNode(this._context);
                break;
            case 'mask':
            case 'svg':
                renderNode = new Container();
                break;
            case 'path':
                renderNode = new SVGPathNode(this._context);
                break;
            case 'text':
                renderNode = new SVGTextNode();
                break;
            case 'use':
                renderNode = new SVGUseNode();
                break;
            default:
                renderNode = null;
                break;
        }

        return renderNode;
    }

    /**
     * Creates a `Paint` object for the given element. This should only be used when sharing the `Paint`
     * is not desired; otherwise, use {@link SVGScene.queryPaint}.
     *
     * This will return `null` if the passed element is not an instance of `SVGElement`.
     *
     * @alpha
     * @param element
     */
     createPaint(element)
    {
        if (!(element instanceof SVGElement))
        {
            return null;
        }

        return new PaintProvider(element);
    }

    /**
     * Creates a lazy paint texture for the paint server.
     *
     * @alpha
     * @param paintServer - The paint server to be rendered.
     */
     createPaintServer(paintServer)
    {
        const renderTexture = RenderTexture.create({
            width: 128,
            height: 128,
        });

        return new PaintServer(paintServer, renderTexture);
    }

    /**
     * Creates a lazy luminance mask for the `SVGMaskElement` or its rendering node.
     *
     * @param ref - The `SVGMaskElement` or its rendering node, if already generated.
     */
     createMask(ref)
    {
        if (ref instanceof SVGElement)
        {
            ref = this.populateSceneRecursive(ref, {
                basePaint: this.queryInheritedPaint(ref),
            });
        }

        const localBounds = ref.getLocalBounds();

        ref.getBounds();

        const maskTexture = RenderTexture.create({
            width: localBounds.width,
            height: localBounds.height,
        });

        const maskSprite = new MaskServer(maskTexture);

        // Lazily render mask when needed.
        maskSprite.addChild(ref);

        return maskSprite;
    }

    /**
     * Returns the rendering node for a mask.
     *
     * @alpha
     * @param ref - The mask element whose rendering node is needed.
     */
     queryMask(ref)
    {
        let queryHit = this._elementToMask.get(ref);

        if (!queryHit)
        {
            queryHit = this.createMask(ref);

            this._elementToMask.set(ref, queryHit);
        }

        return queryHit;
    }

    /**
     * Returns the cached paint of a content element. The returned paint will not account for any paint
     * attributes inherited from ancestor elements.
     *
     * @alpha
     * @param ref - A reference to the content element.
     */
     queryPaint(ref)
    {
        let queryHit = this._elementToPaint.get(ref);

        if (!queryHit)
        {
            queryHit = this.createPaint(ref);
            this._elementToPaint.set(ref, queryHit);
        }

        return queryHit;
    }

    /**
     * Returns an (uncached) inherited paint of a content element.
     *
     * @alpha
     * @param ref
     */
     queryInheritedPaint(ref)
    {
        const paint = this.queryPaint(ref);
        const parentPaint = ref.parentElement && this.queryPaint(ref.parentElement );

        if (!parentPaint)
        {
            return paint;
        }

        return new InheritedPaintProvider(parentPaint, paint);
    }

    /**
     * Parses the internal URL reference into a selector (that can be used to find the
     * referenced element using `this.content.querySelector`).
     *
     * @param url - The reference string, e.g. "url(#id)", "url('#id')", "#id"
     */
     parseReference(url)
    {
        if (url.startsWith('url'))
        {
            let contents = url.slice(4, -1);

            if (contents.startsWith('\'') && contents.endsWith('\''))
            {
                contents = contents.slice(1, -1);
            }

            return contents;
        }

        return url;
    }

    /**
     * Embeds a content `element` into the rendering `node`.
     *
     * This is **not** a stable API.
     *
     * @alpha
     * @param node - The node in this scene that will render the `element`.
     * @param element - The content `element` to be rendered. This must be an element of the SVG document
     *  fragment under `this.content`.
     * @param options - Additional options
     * @param {Paint} [options.basePaint] - The base paint that the element's paint should inherit from
     * @return The base attributes of the element, like paint.
     */
     embedIntoNode(
        node,
        element,
        options

 = {},
    )


    {
        const {
            basePaint,
        } = options;

        // Paint
        const paint = basePaint ? new InheritedPaintProvider(basePaint, this.queryPaint(element)) : this.queryPaint(element);
        const {
            fill,
            opacity,
            stroke,
            strokeDashArray,
            strokeDashOffset,
            strokeLineCap,
            strokeLineJoin,
            strokeMiterLimit,
            strokeWidth,
        } = paint;

        // Transform
        const transform = element instanceof SVGGraphicsElement ? element.transform.baseVal.consolidate() : null;
        const transformMatrix = transform ? transform.matrix : tempMatrix.identity();

        let opacityVal = opacity === null ? 1 : opacity;

        if (node instanceof SVGGraphicsNode)
        {
            if (fill === 'none')
            {
                node.beginFill(0, 0);
            }
            else if (typeof fill === 'number')
            {
                node.beginFill(fill, opacityVal);
            }
            else if (!fill)
            {
                node.beginFill(0, opacityVal);
            }
            else
            {
                const ref = this.parseReference(fill);
                const paintElement = this.content.querySelector(ref);

                if (paintElement && paintElement instanceof SVGGradientElement)
                {
                    const paintServer = this.createPaintServer(paintElement);
                    const paintTexture = paintServer.paintTexture;

                    node.paintServers.push(paintServer);
                    node.beginTextureFill({
                        texture: paintTexture,
                        alpha: opacityVal,
                        matrix: new Matrix(),
                    });
                }
            }

            let strokeTexture;

            if (typeof stroke === 'string' && stroke.startsWith('url'))
            {
                const ref = this.parseReference(stroke);
                const paintElement = this.content.querySelector(ref);

                if (paintElement && paintElement instanceof SVGGradientElement)
                {
                    const paintServer = this.createPaintServer(paintElement);
                    const paintTexture = paintServer.paintTexture;

                    node.paintServers.push(paintServer);
                    strokeTexture = paintTexture;
                }
            }

            node.lineTextureStyle({
                /* eslint-disable no-nested-ternary */
                color: stroke === null ? 0 : (typeof stroke === 'number' ? stroke : 0xffffff),
                cap: strokeLineCap === null ? LINE_CAP.SQUARE : strokeLineCap ,
                dashArray: strokeDashArray,
                dashOffset: strokeDashOffset === null ? strokeDashOffset : 0,
                join: strokeLineJoin === null ? LINE_JOIN.MITER : strokeLineJoin ,
                matrix: new Matrix(),
                miterLimit: strokeMiterLimit === null ? 150 : strokeMiterLimit,
                texture: strokeTexture || Texture.WHITE,
                width: strokeWidth === null ? (typeof stroke === 'number' ? 1 : 0) : strokeWidth,
                /* eslint-enable no-nested-ternary */
            });
        }

        switch (element.nodeName.toLowerCase())
        {
            case 'circle':
                (node ).embedCircle(element );
                break;
            case 'ellipse':
                (node ).embedEllipse(element );
                break;
            case 'image':
                (node ).embedImage(element );
                break;
            case 'line':
                (node ).embedLine(element );
                break;
            case 'path':
                (node ).embedPath(element );
                break;
            case 'polyline':
                (node ).embedPolyline(element );
                break;
            case 'polygon':
                (node ).embedPolygon(element );
                break;
            case 'rect':
                (node ).embedRect(element );
                break;
            case 'text':
                (node ).embedText(element );
                break;
            case 'use': {
                const useElement = element ;
                const useTargetURL = useElement.getAttribute('href') || useElement.getAttribute('xlink:href');
                const usePaint = this.queryPaint(useElement);

                (node ).embedUse(useElement);

                if (useTargetURL.startsWith('#'))
                {
                    const useTarget = this.content.querySelector(useTargetURL);
                    const contentNode = this.populateSceneRecursive(useTarget , {
                        basePaint: usePaint,
                    }) ;

                    (node ).ref = contentNode;
                    contentNode.transform.setFromMatrix(Matrix.IDENTITY);// clear transform
                }
                else if (!this._context.disableHrefSVGLoading)
                {
                    (node ).isRefExternal = true;

                    _load(useTargetURL)
                        .then((svgDocument) => [
                            new SVGScene(svgDocument, {
                                ...this._context,
                                disableRootPopulation: true,
                            }),
                            svgDocument.querySelector('#' + useTargetURL.split('#')[1])
                        ] )
                        .then(([shellScene, useTarget]) =>
                        {
                            if (!useTarget)
                            {
                                console.error(`SVGScene failed to resolve ${useTargetURL} and SVGUseNode is empty!`);
                            }

                            const contentNode = shellScene.populateSceneRecursive(useTarget , {
                                basePaint: usePaint,
                            }) ;

                            (node ).ref = contentNode;
                            contentNode.transform.setFromMatrix(Matrix.IDENTITY);// clear transform

                            this._transformDirty = true;

                            shellScene.on(TRANSFORM_DIRTY, () => {
                                this._transformDirty = true;
                            });
                        });
                }
            }
        }

        node.transform.setFromMatrix(tempMatrix.set(
            transformMatrix.a,
            transformMatrix.b,
            transformMatrix.c,
            transformMatrix.d,
            transformMatrix instanceof Matrix ? transformMatrix.tx : transformMatrix.e,
            transformMatrix instanceof Matrix ? transformMatrix.ty : transformMatrix.f,
        ));

        if (element instanceof SVGMaskElement)
        {
            this._elementToMask.set(element, this.createMask(node));
        }

        const maskURL = element.getAttribute('mask');

        if (maskURL)
        {
            const maskElement = this.content.querySelector(this.parseReference(maskURL));

            if (maskElement)
            {
                const maskServer = this.queryMask(maskElement);
                const maskSprite = maskServer.createMask(node);

                this.renderServers.addChild(maskServer);
                node.mask = maskSprite;
                node.addChild(maskSprite);
            }
        }

        return {
            paint,
        };
    }

    /**
     * Recursively populates a subscene graph that embeds {@code element}. The root of the subscene is returned.
     *
     * @param element - The SVGElement to be embedded.
     * @param options - Inherited attributes from the element's parent, if any.
     * @return The display object that embeds the element for rendering.
     */
     populateSceneRecursive(
        element,
        options

,
    )
    {
        const node = this.createNode(element);

        if (!node)
        {
            return null;
        }

        node.on(NODE_TRANSFORM_DIRTY, this.onNodeTransformDirty);

        let paint;

        if (element instanceof SVGGraphicsElement || element instanceof SVGMaskElement)
        {
            const opts = this.embedIntoNode(node, element, options);

            paint = opts.paint;
        }

        for (let i = 0, j = element.children.length; i < j; i++)
        {
            // eslint-disable-next-line
            // @ts-ignore
            const childNode = this.populateSceneRecursive(element.children[i], {
                basePaint: paint,
            });

            if (childNode)
            {
                node.addChild(childNode);
            }
        }

        if (node instanceof SVGGraphicsNode)
        {
            const bbox = node.getLocalBounds(tempRect);
            const paintServers = node.paintServers;
            const { x, y, width: bwidth, height: bheight } = bbox;

            node.paintServers.forEach((paintServer) =>
            {
                paintServer.resolvePaintDimensions(bbox);
            });

            const geometry = node.geometry;
            const graphicsData = (geometry ).graphicsData;

            if (graphicsData)
            {
                graphicsData.forEach((data) =>
                {
                    const fillStyle = data.fillStyle;
                    const lineStyle = data.lineStyle;

                    if (fillStyle.texture && paintServers.find((server) => server.paintTexture === fillStyle.texture))
                    {
                        const width = fillStyle.texture.width;
                        const height = fillStyle.texture.height;

                        data.fillStyle.matrix
                            .invert()
                            .scale(bwidth / width, bheight / height)
                            .invert();
                    }
                    if (fillStyle.matrix)
                    {
                        fillStyle.matrix
                            .invert()
                            .translate(x, y)
                            .invert();
                    }

                    if (lineStyle.texture && paintServers.find((server) => server.paintTexture === lineStyle.texture))
                    {
                        const width = lineStyle.texture.width;
                        const height = lineStyle.texture.height;

                        data.lineStyle.matrix
                            .invert()
                            .scale(bwidth / width, bheight / height)
                            .invert();
                    }
                    if (lineStyle.matrix)
                    {
                        lineStyle.matrix
                            .invert()
                            .translate(x, y)
                            .invert();
                    }
                });

                geometry.updateBatches();
            }
        }

        if (element instanceof SVGMaskElement)
        {
            // Mask elements are *not* a part of the scene graph.
            return null;
        }

        return node;
    }

    /**
     * Populates the entire SVG scene. This should only be called once after the {@link SVGScene.content} has been set.
     */
     populateScene()
    {
        if (this.root)
        {
            this._cull.remove(this.root);
        }

        const root = this.populateSceneRecursive(this.content);

        this.root = root;
        this._cull.add(this.root);
    }

    /**
     * Handles `nodetransformdirty` events fired by nodes. It will set {@link SVGScene._transformDirty} to true.
     *
     * This will also emit `transformdirty`.
     */
     __init2() {this.onNodeTransformDirty = () =>
    {
        this._transformDirty = true;
        this.emit(TRANSFORM_DIRTY, this);
    };}

    /**
     * The width at which the SVG scene is being rendered. By default, this is the viewbox width specified by
     * the root element.
     */
    get width()
    {
        return this._width;
    }
    set width(value)
    {
        this._width = value;
        this.scale.x = this._width / this.content.viewBox.baseVal.width;
    }

    /**
     * The height at which the SVG scene is being rendered. By default, this is the viewbox height specified by
     * the root element.
     */
    get height()
    {
        return this._height;
    }
    set height(value)
    {
        this._height = value;
        this.scale.y = this._height / this.content.viewBox.baseVal.height;
    }

    /**
     * Load the SVG document and create a {@link SVGScene} asynchronously.
     *
     * A cache is used for loaded SVG documents.
     *
     * @param url
     * @param context
     * @returns
     */
    static async from(url, context) {
        return new SVGScene(await _load(url), context);
    }
}

export { FILL_RULE, InheritedPaintProvider, MaskServer, MaskSprite, PATH, PaintProvider, PaintServer, Path, SVGGraphicsGeometry, SVGGraphicsNode, SVGImageNode, SVGPathNode, SVGScene, SVGTextEngineImpl, SVGTextNode, SVGUseNode, getLoaderCache };
//# sourceMappingURL=svg.es.js.map

import { AbstractPoint, DistanceOverlayInfo, Distances, Offset } from ".."
import { ULabelAnnotation } from "./annotation"
import { get_annotation_class_id } from "./annotation_operators"
import { ULabelSpatialPayload2D } from "./geometric_utils"

/**
 * Basic class to hold generic methods useful for creating overlays.
 */
class ULabelOverlay {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D

    constructor(canvas_width: number, canvas_height: number) {
        this.createCanvas(canvas_width, canvas_height)

        this.context = this.canvas.getContext("2d")

        this.add_styles()
    }

    private add_styles() {
        const css = `
        /* Very Important. Annotation interaction breaks without this property when overlays are present */
        .ulabel-overlay {
            pointer-events: none; 
        }`

        // Create an id so this specific style tag can be referenced
        const style_id = "overlay-styles"

        // Don't add the style tag if its already been added once
        if (document.getElementById(style_id)) return

        // Grab the document's head and create a style tag
        const head = document.head || document.querySelector("head")
        const style = document.createElement('style');

        // Add the css and id to the style tag
        style.appendChild(document.createTextNode(css));
        style.id = style_id

        // Add the style tag to the document's head
        head.appendChild(style);
    }

    public createCanvas(canvas_width, canvas_height): void {
        // Create the canvas element
        this.canvas = document.createElement("canvas")

        // Add a class to identify created overlays
        this.canvas.setAttribute("class", "ulabel-overlay")

        // Overlays should on top of everything, so give it a reasonably large z-index
        this.canvas.style.zIndex = "101"
        this.canvas.style.position = "relative"

        // Set the width and height
        this.canvas.width = canvas_width
        this.canvas.height = canvas_height
    }

    public resize_canvas(new_width, new_height): void {
        this.canvas.width = new_width
        this.canvas.height = new_height
    }

    /**
     * Clears everything drawn to the canvas. Useful for re-drawing.
     */
    public clearCanvas(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws a circle centered at (x_position, y_position) with a radius of the passed in radius.
     * Circle is filled in.
     * 
     * @param x_position x-position of the circle
     * @param y_position y-position of the circle
     * @param radius The radius of the circle
     */
    protected drawCircle(point: AbstractPoint, radius: number): void {
        // Start the shape
        this.context.beginPath()

        // Draw the outline of a circle around the x and y positions with a radius of radius
        this.context.arc(point.x, point.y, radius, 0, 2 * Math.PI)

        // Fill the circle
        this.context.fill()

        // Actually apply the shape to the canvas
        this.context.stroke()
    }

    /**
     * A method to get a reference to this object's canvas
     * 
     * @returns A reference to this object's canvas
     */
    public getCanvas(): HTMLCanvasElement {
        return this.canvas
    }
}

export class FilterDistanceOverlay extends ULabelOverlay {
    polyline_annotations: ULabelAnnotation[] // Set of polyline annotations the overlay will be drawn based on
    distances: Distances = { // The current distance from a line annotation
        "single": null 
    }
    multi_class_mode: boolean
    zoom_value: number // How zoomed in ulabel is
    display_overlay: boolean // Whether or not the overlay should currently be displayed

    constructor(canvas_width: number, canvas_height: number, polyline_annotations: ULabelAnnotation[]) {
        super(canvas_width, canvas_height)

        // Set the canvas id so it can be referenced easily outside this class
        this.canvas.setAttribute("id","ulabel-filter-distance-overlay")

        // Set the annotations that will be used when drawing the overlay
        this.polyline_annotations = polyline_annotations
    }

    /**
     * Given the x and y coordinate of two points, this returns a vector that is perpendicular to 
     * the line between the two points and has a magnitude of 1.
     * 
     * @param endpoint_1 
     * @param endpoint_2
     * @returns A normal vector
     */
    private claculateNormalVector(endpoint_1: AbstractPoint, endpoint_2: AbstractPoint): AbstractPoint {
        // Calculate the x and y of the normal vector
        let normal_x: number = endpoint_1.y - endpoint_2.y
        let normal_y: number = endpoint_2.x - endpoint_1.x

        // Create a constant scalar value to divide the normal vector by to make its magnitude 1
        const scalar: number = Math.sqrt((normal_x ** 2) + (normal_y ** 2))

        // Prevent divide by 0 error
        if (scalar === 0) {
            // This will happen when point 1 and point 2 are the same point
            // In which case the concept of a normal vector doesn't really apply
            console.error("claculateNormalVector divide by 0 error")
            return null
        }

        // Set the magnitude equal to 1
        normal_x /= scalar
        normal_y /= scalar

        return {
            "x": normal_x,
            "y": normal_y
        }
    }

    /**
     * Given the x and y values of two points, a normal vector, and a distance value, draws a parrallelogram 
     * "parallel" to the line segment formed between the two points with a width in each direction of distance.
     * 
     * @param endpoint_1 One of the line segment's endpoints
     * @param endpoint_2 One of the line segment's endpoints
     * @param normal_vector Line segment's normal vector
     * @param distance The distance in each direction around the line segment
     */
    private drawParallelogramAroundLineSegment(
        endpoint_1: AbstractPoint,
        endpoint_2: AbstractPoint,
        normal_vector: AbstractPoint,
        distance: number
    ): void {
        // Calculate the change in x and y
        const dx = normal_vector.x * distance
        const dy = normal_vector.y * distance

        // Calculate the 4 corners of the parallelogram
        const corner1: [number, number] = [endpoint_1.x - dx, endpoint_1.y - dy]
        const corner2: [number, number] = [endpoint_1.x + dx, endpoint_1.y + dy]
        const corner3: [number, number] = [endpoint_2.x + dx, endpoint_2.y + dy]
        const corner4: [number, number] = [endpoint_2.x - dx, endpoint_2.y - dy]

        // Tell the context to begin a new path
        this.context.beginPath()

        this.context.moveTo(corner1[0], corner1[1])
        this.context.lineTo(corner2[0], corner2[1])
        this.context.lineTo(corner3[0], corner3[1])
        this.context.lineTo(corner4[0], corner4[1])

        this.context.fill()
    }

    public updateAnnotations(polyline_annotations: ULabelAnnotation[]) {
        this.polyline_annotations = polyline_annotations
    }

    public updateDistance(distances: {[key: string]: number}) {
        for (let key in distances) {
            // Update this.distances's values with the values inside distances
            this.distances[key] = distances[key]
        }
    }

    public update_mode(current_mode: "single" | "multi") {
        if (current_mode === "multi") {
            this.multi_class_mode = true
        }
        else if (current_mode === "single") {
            this.multi_class_mode = false
        }
        else {
            console.error("FilterDistanceOverlay.update_mode recieved unknown mode type")
        }
    }

    public update_zoom_value(zoom_value: number) {
        this.zoom_value = zoom_value
    }

    public update_display_overlay(display_overlay: boolean) {
        this.display_overlay = display_overlay
    }

    /**
     * Update the overlay to obscure the parts of the image that fall outside of the distance filter.
     * 
     * @param polyline_annotations Array of polyline annotations the overlay is being applied to
     * @param distance The distance from each annotation to be shown through the overlay
     * @param zoom_val Value to scale the coordinate system by
     * @param multi_class_mode Whether or not the filter is currently in multi-class mode
     */
    public drawOverlay(offset: Offset = null): void {
        // Clear the canvas in order to have a clean slate to re-draw from
        this.clearCanvas()

        // If the overlay shouldn't be displayed then return after clearing the canvas
        if (!this.display_overlay) return
        
        // Fill the entire canvas with the overlay that we'll subtract from
        this.context.globalCompositeOperation = "source-over" // Resetting default
        this.context.fillStyle = "#000000" 
        this.context.globalAlpha = 0.5 // So you can slightly see through the overlay
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height) // Draws the overlay

        // Set it so that all future shapes we draw subtract from the overlay
        this.context.globalCompositeOperation = "destination-out"

        // Reset default alpha
        this.context.globalAlpha = 1

        // Subtract the appropriate area from the overlay around each annotation
        this.polyline_annotations.forEach(annotation => {

            // Grab the annotation's spatial payload and id
            const spatial_payload: ULabelSpatialPayload2D = annotation.spatial_payload
            const annotation_class_id: string = get_annotation_class_id(annotation)
            
            // Use the class id if in multi-class mode, otherwise use the single class distance
            let distance: number = this.multi_class_mode ? this.distances[annotation_class_id] : this.distances["single"]
            distance *= this.zoom_value

            // length - 1 because the final endpoint doesn't have another endpoint to form a pair with
            for (let idx = 0; idx < spatial_payload.length - 1; idx++) {
                // Look at segment endpoints in pairs
                let endpoint_1: AbstractPoint = {
                    "x": spatial_payload[idx][0],
                    "y": spatial_payload[idx][1]
                }
                let endpoint_2: AbstractPoint = {
                    "x": spatial_payload[idx + 1][0],
                    "y": spatial_payload[idx + 1][1]
                }

                // If the offset exists and the current annotation id matches the offset id, then scale the each endpoint by the offset diff
                if ((offset !== undefined && offset !== null) && (annotation.id === offset.id)) {
                    endpoint_1.x += offset.diffX
                    endpoint_1.y += offset.diffY
                    endpoint_2.x += offset.diffX
                    endpoint_2.y += offset.diffY
                }

                // Scale each endpoint by the zoom_val
                endpoint_1.x *= this.zoom_value
                endpoint_1.y *= this.zoom_value
                endpoint_2.x *= this.zoom_value
                endpoint_2.y *= this.zoom_value

                // Get a vector that's perpendicular to endpoint_1 and endpoint_2 and has a magnitude of 1
                const normal_vector: AbstractPoint = this.claculateNormalVector(endpoint_1, endpoint_2)

                /* In the case the endpoint_1 === endpoint_2 the normal vector will be null
                   In which case draw a circle around one endpoint and skip to the next annotation. */
                if (normal_vector === null) {
                    this.drawCircle(endpoint_1, distance)
                    continue
                }
                
                // Only on the first time through draw a circle around the first endpoint
                if (idx === 0) this.drawCircle(endpoint_1, distance)

                // Draw an endpoint around the second endpoint
                this.drawCircle(endpoint_2, distance)

                // Draw a parallelogram around the polyline segment
                this.drawParallelogramAroundLineSegment(endpoint_1, endpoint_2, normal_vector, distance)
            }
        })
    }
}
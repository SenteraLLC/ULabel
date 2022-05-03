"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeypointSlider = exports.RecolorActiveItem = exports.AnnotationResizeItem = exports.ClassCounterToolboxItem = exports.AnnotationIDToolboxItem = exports.LinestyleToolboxItem = exports.ZoomPanToolboxItem = exports.ModeSelectionToolboxItem = exports.ToolboxItem = exports.ToolboxTab = exports.Toolbox = void 0;
var __1 = require("..");
var toolboxDividerDiv = "<div class=toolbox-divider></div>";
function read_annotation_confidence() {
    return;
}
/**
 * Manager for toolbox. Contains ToolboxTab items.
 */
var Toolbox = /** @class */ (function () {
    // public tabs: ToolboxTab[] = [];
    // public items: ToolboxItem[] = []; 
    function Toolbox(tabs, items) {
        if (tabs === void 0) { tabs = []; }
        if (items === void 0) { items = []; }
        this.tabs = tabs;
        this.items = items;
    }
    Toolbox.prototype.setup_toolbox_html = function (ulabel, frame_annotation_dialogs, images, ULABEL_VERSION) {
        // Setup base div and ULabel version header
        var toolbox_html = "\n        <div class=\"full_ulabel_container_\">\n            ".concat(frame_annotation_dialogs, "\n            <div id=\"").concat(ulabel.config["annbox_id"], "\" class=\"annbox_cls\">\n                <div id=\"").concat(ulabel.config["imwrap_id"], "\" class=\"imwrap_cls ").concat(ulabel.config["imgsz_class"], "\">\n                    ").concat(images, "\n                </div>\n            </div>\n            <div id=\"").concat(ulabel.config["toolbox_id"], "\" class=\"toolbox_cls\">\n                <div class=\"toolbox-name-header\">\n                    <h1 class=\"toolname\"><a class=\"repo-anchor\" href=\"https://github.com/SenteraLLC/ulabel\">ULabel</a> <span class=\"version-number\">v").concat(ULABEL_VERSION, "</span></h1><!--\n                    --><div class=\"night-button-cont\">\n                        <a href=\"#\" class=\"night-button\">\n                            <div class=\"night-button-track\">\n                                <div class=\"night-status\"></div>\n                            </div>\n                        </a>\n                    </div>\n                </div>\n                <div class=\"toolbox_inner_cls\">\n        ");
        for (var tbitem in this.items) {
            toolbox_html += this.items[tbitem].get_html() + toolboxDividerDiv;
        }
        toolbox_html += "\n                </div>\n                <div class=\"toolbox-tabs\">\n                    ".concat(this.get_toolbox_tabs(ulabel), "\n                </div> \n            </div>\n        </div>");
        return toolbox_html;
    };
    /**
     * Adds tabs for each ULabel subtask to the toolbox.
     */
    Toolbox.prototype.get_toolbox_tabs = function (ulabel) {
        var ret = "";
        for (var st_key in ulabel.subtasks) {
            var selected = st_key == ulabel.state["current_subtask"];
            var subtask = ulabel.subtasks[st_key];
            var current_tab = new ToolboxTab([], subtask, st_key, selected);
            ret += current_tab.html;
            this.tabs.push(current_tab);
        }
        return ret;
    };
    Toolbox.prototype.redraw_update_items = function (ulabel) {
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var tbitem = _a[_i];
            tbitem.redraw_update(ulabel);
        }
    };
    return Toolbox;
}());
exports.Toolbox = Toolbox;
var ToolboxTab = /** @class */ (function () {
    function ToolboxTab(toolboxitems, subtask, subtask_key, selected) {
        if (toolboxitems === void 0) { toolboxitems = []; }
        if (selected === void 0) { selected = false; }
        this.toolboxitems = toolboxitems;
        this.subtask = subtask;
        this.subtask_key = subtask_key;
        this.selected = selected;
        var sel = "";
        var href = " href=\"#\"";
        var val = 50;
        if (this.selected) {
            if (this.subtask.read_only) {
                href = "";
            }
            sel = " sel";
            val = 100;
        }
        console.log(subtask.display_name);
        console.log(subtask);
        this.html = "\n        <div class=\"tb-st-tab".concat(sel, "\">\n            <a").concat(href, " id=\"tb-st-switch--").concat(subtask_key, "\" class=\"tb-st-switch\">").concat(this.subtask.display_name, "</a><!--\n            --><span class=\"tb-st-range\">\n                <input id=\"tb-st-range--").concat(subtask_key, "\" type=\"range\" min=0 max=100 value=").concat(val, " />\n            </span>\n        </div>\n        ");
    }
    return ToolboxTab;
}());
exports.ToolboxTab = ToolboxTab;
var ToolboxItem = /** @class */ (function () {
    function ToolboxItem() {
    }
    ToolboxItem.prototype.redraw_update = function (ulabel) { };
    ToolboxItem.prototype.frame_update = function (ulabel) { };
    return ToolboxItem;
}());
exports.ToolboxItem = ToolboxItem;
/**
 * Toolbox item for selecting annotation mode.
 */
var ModeSelectionToolboxItem = /** @class */ (function (_super) {
    __extends(ModeSelectionToolboxItem, _super);
    function ModeSelectionToolboxItem() {
        return _super.call(this) || this;
    }
    ModeSelectionToolboxItem.prototype.get_html = function () {
        return "\n        <div class=\"mode-selection\">\n            <p class=\"current_mode_container\">\n                <span class=\"cmlbl\">Mode:</span>\n                <span class=\"current_mode\"></span>\n            </p>\n        </div>\n        ";
    };
    return ModeSelectionToolboxItem;
}(ToolboxItem));
exports.ModeSelectionToolboxItem = ModeSelectionToolboxItem;
/**
 * Toolbox item for zooming and panning.
 */
var ZoomPanToolboxItem = /** @class */ (function (_super) {
    __extends(ZoomPanToolboxItem, _super);
    function ZoomPanToolboxItem(frame_range) {
        var _this = _super.call(this) || this;
        _this.frame_range = frame_range;
        return _this;
    }
    ZoomPanToolboxItem.prototype.get_html = function () {
        return "\n        <div class=\"zoom-pan\">\n            <div class=\"half-tb htbmain set-zoom\">\n                <p class=\"shortcut-tip\">ctrl+scroll or shift+drag</p>\n                <div class=\"zpcont\">\n                    <div class=\"lblpyldcont\">\n                        <span class=\"pzlbl htblbl\">Zoom</span>\n                        <span class=\"zinout htbpyld\">\n                            <a href=\"#\" class=\"zbutt zout\">-</a>\n                            <a href=\"#\" class=\"zbutt zin\">+</a>\n                        </span>\n                    </div>\n                </div>\n            </div><!--\n            --><div class=\"half-tb htbmain set-pan\">\n                <p class=\"shortcut-tip\">scrollclick+drag or ctrl+drag</p>\n                <div class=\"zpcont\">\n                    <div class=\"lblpyldcont\">\n                        <span class=\"pzlbl htblbl\">Pan</span>\n                        <span class=\"panudlr htbpyld\">\n                            <a href=\"#\" class=\"pbutt left\"></a>\n                            <a href=\"#\" class=\"pbutt right\"></a>\n                            <a href=\"#\" class=\"pbutt up\"></a>\n                            <a href=\"#\" class=\"pbutt down\"></a>\n                            <span class=\"spokes\"></span>\n                        </span>\n                    </div>\n                </div>\n            </div>\n            <div class=\"recenter-cont\" style=\"text-align: center;\">\n                <a href=\"#\" id=\"recenter-button\">Re-Center</a>\n            </div>\n            ".concat(this.frame_range, "\n        </div>\n        ");
    };
    return ZoomPanToolboxItem;
}(ToolboxItem));
exports.ZoomPanToolboxItem = ZoomPanToolboxItem;
/**
 * Toolbox Item for selecting line style.
 */
var LinestyleToolboxItem = /** @class */ (function (_super) {
    __extends(LinestyleToolboxItem, _super);
    function LinestyleToolboxItem(canvas_did, demo_width, demo_height, px_per_px) {
        var _this = _super.call(this) || this;
        _this.canvas_did = canvas_did;
        _this.demo_width = demo_width;
        _this.demo_height = demo_height;
        _this.px_per_px = px_per_px;
        return _this;
    }
    LinestyleToolboxItem.prototype.get_html = function () {
        return "\n        <div class=\"linestyle\">\n            <p class=\"tb-header\">Line Width</p>\n            <div class=\"lstyl-row\">\n                <div class=\"line-expl\">\n                    <a href=\"#\" class=\"wbutt wout\">-</a>\n                    <canvas \n                        id=\"".concat(this.canvas_did, "\" \n                        class=\"demo-canvas\" \n                        width=").concat(this.demo_width * this.px_per_px, "} \n                        height=").concat(this.demo_height * this.px_per_px, "></canvas>\n                    <a href=\"#\" class=\"wbutt win\">+</a>\n                </div><!--\n                --><div class=\"setting\">\n                    <a class=\"fixed-setting\">Fixed</a><br>\n                    <a href=\"#\" class=\"dyn-setting\">Dynamic</a>\n                </div>\n            </div>\n        </div>\n        ");
    };
    return LinestyleToolboxItem;
}(ToolboxItem));
exports.LinestyleToolboxItem = LinestyleToolboxItem;
/**
 * Toolbox item for selection Annotation ID.
 */
var AnnotationIDToolboxItem = /** @class */ (function (_super) {
    __extends(AnnotationIDToolboxItem, _super);
    function AnnotationIDToolboxItem(instructions) {
        var _this = _super.call(this) || this;
        _this.instructions = instructions;
        return _this;
    }
    AnnotationIDToolboxItem.prototype.get_html = function () {
        return "\n        <div class=\"classification\">\n            <p class=\"tb-header\">Annotation ID</p>\n            <div class=\"id-toolbox-app\"></div>\n        </div>\n        <div class=\"toolbox-refs\">\n            ".concat(this.instructions, "\n        </div>\n        ");
    };
    return AnnotationIDToolboxItem;
}(ToolboxItem));
exports.AnnotationIDToolboxItem = AnnotationIDToolboxItem;
var ClassCounterToolboxItem = /** @class */ (function (_super) {
    __extends(ClassCounterToolboxItem, _super);
    function ClassCounterToolboxItem() {
        var _this = _super.call(this) || this;
        _this.inner_HTML = "<p class=\"tb-header\">Annotation Count</p>";
        return _this;
    }
    ClassCounterToolboxItem.prototype.update_toolbox_counter = function (subtask, toolbox_id) {
        if (subtask == null) {
            return;
        }
        var class_ids = subtask.class_ids;
        var i, j;
        var class_counts = {};
        for (i = 0; i < class_ids.length; i++) {
            class_counts[class_ids[i]] = 0;
        }
        var annotations = subtask.annotations.access;
        var annotation_ids = subtask.annotations.ordering;
        var current_annotation, current_payload;
        for (i = 0; i < annotation_ids.length; i++) {
            current_annotation = annotations[annotation_ids[i]];
            if (current_annotation.deprecated == false) {
                for (j = 0; j < current_annotation.classification_payloads.length; j++) {
                    current_payload = current_annotation.classification_payloads[j];
                    if (current_payload.confidence > 0.0) {
                        class_counts[current_payload.class_id] += 1;
                        break;
                    }
                }
            }
        }
        var f_string = "";
        var class_name, class_count;
        for (i = 0; i < class_ids.length; i++) {
            class_name = subtask.class_defs[i].name;
            // MF-Tassels Hack
            if (class_name.includes("OVERWRITE")) {
                continue;
            }
            class_count = class_counts[subtask.class_defs[i].id];
            f_string += "".concat(class_name, ": ").concat(class_count, "<br>");
        }
        this.inner_HTML = "<p class=\"tb-header\">Annotation Count</p>" + "<p>".concat(f_string, "</p>");
    };
    ClassCounterToolboxItem.prototype.get_html = function () {
        return "\n        <div class=\"toolbox-class-counter\">" + this.inner_HTML + "</div>";
    };
    ClassCounterToolboxItem.prototype.redraw_update = function (ulabel) {
        this.update_toolbox_counter(ulabel.subtasks[ulabel.state["current_subtask"]], ulabel.config["toolbox_id"]);
        $("#" + ulabel.config["toolbox_id"] + " div.toolbox-class-counter").html(this.inner_HTML);
    };
    return ClassCounterToolboxItem;
}(ToolboxItem));
exports.ClassCounterToolboxItem = ClassCounterToolboxItem;
/**
 * Toolbox item for resizing all annotations
 */
var AnnotationResizeItem = /** @class */ (function (_super) {
    __extends(AnnotationResizeItem, _super);
    function AnnotationResizeItem(ulabel) {
        var _this = _super.call(this) || this;
        _this.is_vanished = false;
        _this.cached_size = 1.5;
        _this.inner_HTML = "<p class=\"tb-header\">Annotation Count</p>";
        //Sets the default line size
        //event listener for buttons
        $(document).on("click", "a.butt-ann", function (e) {
            var button = $(e.currentTarget);
            var current_subtask_key = ulabel.state["current_subtask"];
            var current_subtask = ulabel.subtasks[current_subtask_key];
            var annotation_size = button.attr("id").slice(18);
            _this.update_annotation_size(current_subtask, annotation_size);
            ulabel.redraw_all_annotations(null, null, false);
        });
        //event listener for keybinds
        $(document).on("keypress", function (e) {
            var current_subtask_key = ulabel.state["current_subtask"];
            var current_subtask = ulabel.subtasks[current_subtask_key];
            console.log(e.which);
            switch (e.which) {
                case 118:
                    _this.update_annotation_size(current_subtask, "v");
                    break;
                case 115:
                    _this.update_annotation_size(current_subtask, "s");
                    break;
                case 108:
                    _this.update_annotation_size(current_subtask, "l");
                    break;
                case 45:
                    _this.update_annotation_size(current_subtask, "dec");
                    break;
                case 61:
                    _this.update_annotation_size(current_subtask, "inc");
                    break;
            }
            ulabel.redraw_all_annotations(null, null, false);
        });
        return _this;
    }
    //recieives a string of 's', 'l', 'dec', 'inc', or 'v' depending on which button was pressed
    AnnotationResizeItem.prototype.update_annotation_size = function (subtask, size) {
        var small_size = 1.5;
        var large_size = 5;
        var increment_size = 0.5;
        var vanish_size = 0.01;
        if (subtask == null)
            return;
        //If the annotations are currently vanished and a button other than the vanish button is
        //pressed, then we want to ignore the input
        if (this.is_vanished && size !== "v")
            return;
        if (size == "v") {
            if (this.is_vanished) {
                this.loop_through_annotations(subtask, this.cached_size, "=");
                //flip the bool state
                this.is_vanished = !this.is_vanished;
                $("#annotation-resize-v").attr("style", "background-color: " + "rgba(100, 148, 237, 0.8)");
                return;
            }
            if (this.is_vanished !== true) {
                this.loop_through_annotations(subtask, vanish_size, "=");
                //flip the bool state
                this.is_vanished = !this.is_vanished;
                $("#annotation-resize-v").attr("style", "background-color: " + "#1c2d4d");
                return;
            }
            return;
        }
        switch (size) {
            case 's':
                this.loop_through_annotations(subtask, small_size, "=");
                this.cached_size = small_size;
                break;
            case 'l':
                this.loop_through_annotations(subtask, large_size, "=");
                this.cached_size = large_size;
                break;
            case 'dec':
                this.loop_through_annotations(subtask, increment_size, "-");
                break;
            case 'inc':
                this.loop_through_annotations(subtask, increment_size, "+");
                break;
            default:
                return;
        }
    };
    //loops through all annotations in a subtask to change their line size
    AnnotationResizeItem.prototype.loop_through_annotations = function (subtask, size, operation) {
        if (operation == "=") {
            for (var annotation_id in subtask.annotations.access) {
                subtask.annotations.access[annotation_id].line_size = size;
            }
            return;
        }
        if (operation == "+") {
            for (var annotation_id in subtask.annotations.access) {
                subtask.annotations.access[annotation_id].line_size += size;
                //temporary solution
                this.cached_size = subtask.annotations.access[annotation_id].line_size;
            }
            return;
        }
        if (operation == "-") {
            for (var annotation_id in subtask.annotations.access) {
                //Check to make sure annotation line size won't go 0 or negative. If it would
                //set it equal to a small positive number
                if (subtask.annotations.access[annotation_id].line_size - size <= 0.01) {
                    subtask.annotations.access[annotation_id].line_size = 0.01;
                }
                else {
                    subtask.annotations.access[annotation_id].line_size -= size;
                }
                //temporary solution
                this.cached_size = subtask.annotations.access[annotation_id].line_size;
            }
            return;
        }
        return;
    };
    AnnotationResizeItem.prototype.get_html = function () {
        return "\n        <div class=\"annotation-resize\">\n            <p class=\"tb-header\">Change Annotation Size</p>\n            <div class=\"annotation-resize-button-holder\">\n                <span class=\"annotation-vanish\">\n                    <a href=\"#\" class=\"butt-ann\" id=\"annotation-resize-v\">Vanish</a>\n                </span>\n                <span class=\"annotation-size\">\n                    <a href=\"#\" class=\"butt-ann\" id=\"annotation-resize-s\">Small</a>\n                    <a href=\"#\" class=\"butt-ann\" id=\"annotation-resize-l\">Large</a>\n                </span>\n                <span class=\"annotation-inc\">\n                    <a href=\"#\" class=\"butt-ann\" id=\"annotation-resize-inc\">+</a>\n                    <a href=\"#\" class=\"butt-ann\" id=\"annotation-resize-dec\">-</a>\n                </span>\n            </div>\n        </div>\n        ";
    };
    return AnnotationResizeItem;
}(ToolboxItem));
exports.AnnotationResizeItem = AnnotationResizeItem;
var RecolorActiveItem = /** @class */ (function (_super) {
    __extends(RecolorActiveItem, _super);
    function RecolorActiveItem(ulabel) {
        var _this = _super.call(this) || this;
        _this.inner_HTML = "<p class=\"tb-header\">Recolor Annotations</p>";
        //event handler for the buttons
        $(document).on("click", "input.color-change-btn", function (e) {
            var button = $(e.currentTarget);
            var current_subtask_key = ulabel.state["current_subtask"];
            var current_subtask = ulabel.subtasks[current_subtask_key];
            //slice 13,16 to grab the part of the id that specifies color
            var color_from_id = button.attr("id").slice(13, 16);
            _this.update_annotation_color(current_subtask, color_from_id);
            __1.ULabel.process_classes(ulabel, ulabel.state.current_subtask, current_subtask);
            //ULabel.build_id_dialogs(ulabel)
            ulabel.redraw_all_annotations(null, null, false);
        });
        $(document).on("input", "input.color-change-picker", function (e) {
            //Gets the current subtask
            var current_subtask_key = ulabel.state["current_subtask"];
            var current_subtask = ulabel.subtasks[current_subtask_key];
            //Gets the hex value from the color picker
            var hex = e.currentTarget.value;
            _this.update_annotation_color(current_subtask, hex);
            //somewhat janky way to update the color on the color picker 
            //to allow for more css options
            var color_picker_container = document.getElementById("color-picker-container");
            color_picker_container.style.backgroundColor = hex;
            __1.ULabel.process_classes(ulabel, ulabel.state.current_subtask, current_subtask);
            //ULabel.build_id_dialogs(ulabel)
            ulabel.redraw_all_annotations(null, null, false);
        });
        return _this;
    }
    RecolorActiveItem.prototype.update_annotation_color = function (subtask, color) {
        //check for the three special cases, otherwise assume color is a hex value
        if (color == "yel") {
            color = "Yellow";
        }
        if (color == "red") {
            color = "Red";
        }
        if (color == "cya") {
            color = "Cyan";
        }
        var selected_id = "none";
        subtask.state.id_payload.forEach(function (item) {
            if (item.confidence == 1) {
                selected_id = item.class_id;
            }
        });
        //if the selected id is still none, then that means that no id had a
        //confidence of 1. Therefore the default is having the first annotation
        //id selected, so we'll default to that
        if (selected_id == "none") {
            selected_id = subtask.classes[0].id;
        }
        // console.log(selected_id)
        subtask.classes.forEach(function (item) {
            if (item.id === selected_id) {
                item.color = color;
            }
        });
        //$("a.toolbox_sel_"+selected_id+":first").attr("backround-color", color);
        var colored_square_element = ".toolbox_colprev_" + selected_id;
        $(colored_square_element).attr("style", "background-color: " + color);
    };
    RecolorActiveItem.prototype.get_html = function () {
        return "\n        <div class=\"recolor-active\">\n            <p class=\"tb-header\">Recolor Annotations</p>\n            <div class=\"annotation-recolor-button-holder\">\n                <div class=\"color-btn-container\">\n                    <input type=\"button\" class=\"color-change-btn\" id=\"color-change-yel\">\n                    <input type=\"button\" class=\"color-change-btn\" id=\"color-change-red\">\n                    <input type=\"button\" class=\"color-change-btn\" id=\"color-change-cya\">\n                </div>\n                <div class=\"color-picker-container\" id=\"color-picker-container\">\n                    <input type=\"color\"  class=\"color-change-picker\" id=\"color-change-pick\">\n                </div>\n            </div>\n        </div>\n        ";
    };
    return RecolorActiveItem;
}(ToolboxItem));
exports.RecolorActiveItem = RecolorActiveItem;
var KeypointSlider = /** @class */ (function (_super) {
    __extends(KeypointSlider, _super);
    function KeypointSlider(ulabel, get_annotation_confidence) {
        var _this = _super.call(this) || this;
        _this.inner_HTML = "<p class=\"tb-header\">Keypoint Slider</p>";
        $(document).on("input", "#keypoint-slider", function (e) {
            var current_subtask_key = ulabel.state["current_subtask"];
            var current_subtask = ulabel.subtasks[current_subtask_key];
            $("#keypoint-slider-label").text(e.currentTarget.value + "%");
            var annotation_confidence = get_annotation_confidence(current_subtask);
            _this.draw_histogram(current_subtask, annotation_confidence);
            _this.update_annotations(current_subtask, annotation_confidence, e.currentTarget.value / 100);
            ulabel.redraw_all_annotations(null, null, false);
        });
        return _this;
    }
    //annotation_confidence should be in the form [{id: "", confidence: "", class_id: ""}, {id: "", confidence: "", class_id: ""}, ...]
    KeypointSlider.prototype.update_annotations = function (subtask, annotation_confidence, filter_value) {
        for (var annotation in annotation_confidence) {
            if (annotation_confidence[annotation].confidence < filter_value) {
                subtask.annotations.access[annotation_confidence[annotation].id].deprecated = true;
            }
            if (annotation_confidence[annotation].confidence >= filter_value) {
                subtask.annotations.access[annotation_confidence[annotation].id].deprecated = false;
            }
        }
    };
    KeypointSlider.prototype.make_histogram = function (subtask, annotation_confidence) {
    };
    KeypointSlider.prototype.draw_histogram = function (subtask, annotation_confidence) {
        var canvas = document.getElementById("histogram");
        var ctx = canvas.getContext("2d");
        this.draw_grid(ctx, canvas.width, canvas.height, 11, "#444444");
        this.draw_line(ctx, canvas.width / 11, 0, canvas.width / 11, 10 * canvas.height / 11, "#FFFF00");
        this.draw_line(ctx, canvas.width / 11, 10 * canvas.height / 11, canvas.width, 10 * canvas.height / 11, "#FFFF00");
        this.draw_rectangle(ctx, 0, 0, canvas.width / 14, canvas.height, "#FFFFFF");
        this.draw_rectangle(ctx, 0, canvas.height - (canvas.height / 16), canvas.width, canvas.height, "#FFFFFF");
    };
    //x1, y1 is the x,y coordinate of the first endpoint, x2, y2 is the 
    //x,y coordinate of the second endpoint.
    KeypointSlider.prototype.draw_line = function (ctx, x1, y1, x2, y2, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    };
    KeypointSlider.prototype.draw_rectangle = function (ctx, upper_left_x, upper_left_y, width, height, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(upper_left_x, upper_left_y, width, height);
        ctx.restore();
    };
    KeypointSlider.prototype.draw_rectangle_with_border = function (ctx, upper_left_x, upper_left_y, width, height, fill_color, border_color) {
        ctx.save();
        this.draw_rectangle(ctx, upper_left_x, upper_left_y, width, height, border_color);
        this.draw_rectangle(ctx, upper_left_x + 1, upper_left_y + 1, width - 2, height - 2, fill_color);
        ctx.restore();
    };
    KeypointSlider.prototype.draw_grid = function (ctx, canvas_width, canvas_height, grid_size, color) {
        ctx.save();
        var len = canvas_width / grid_size;
        //draws the vertical lines in the grid
        for (var i = 1; (i < len); i++) {
            this.draw_line(ctx, len * i, 0, len * i, canvas_height, color);
        }
        //draws the horizontal lines in the grid
        len = canvas_height / grid_size;
        for (var i = 1; (i < len); i++) {
            this.draw_line(ctx, 0, len * i, canvas_width, len * i, color);
        }
        ctx.restore();
    };
    KeypointSlider.prototype.get_html = function () {
        return "\n        <div class=\"keypoint-slider\">\n            <p class=\"tb-header\">Keypoint Slider</p>\n            <div id=\"histogram\">\n                200 <br/><br/> 100 <br/><br/> 0\n                <ul>\n                    <li>30:2007:lightblue</li>\n                    <li>40:2008:lightgreen</li>\n                    <li>80:2009:yellow</li>\n                    <li>14:2010:cyan</li>\n\n                </ul>\n            </div>\n            <canvas id=\"histogra\"><div>Inside canvas</div></canvas>\n            <div class=\"keypoint-slider-holder\">\n                <input type=\"range\" id=\"keypoint-slider\">\n                <label for=\"keypoint-slider\" id=\"keypoint-slider-label\">50%</label>\n            </div>\n        </div>\n        ";
    };
    return KeypointSlider;
}(ToolboxItem));
exports.KeypointSlider = KeypointSlider;
// export class WholeImageClassifierToolboxTab extends ToolboxItem {
//     constructor() {
//         super(
//             "toolbox-whole-image-classifier",
//             "Whole Image Classification",
//             ""
//         );
//     }
// }

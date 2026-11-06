import React from "react";
import { observer } from "mobx-react";
import Select from "react-select";

import { isArray } from "eez-studio-shared/util";

import {
    EezObject,
    EnumItem,
    IEezObject,
    ProjectType,
    PropertyInfo,
    PropertyProps,
    PropertyType
} from "project-editor/core/object";

import { ProjectStore } from "project-editor/store";

import {
    LVGLStylePropCode,
    LVGL_STYLE_PROP_CODES,
    LV_FLEX_ALIGN_CENTER,
    LV_FLEX_ALIGN_END,
    LV_FLEX_ALIGN_SPACE_AROUND,
    LV_FLEX_ALIGN_SPACE_BETWEEN,
    LV_FLEX_ALIGN_SPACE_EVENLY,
    LV_FLEX_ALIGN_START,
    LV_FLEX_FLOW_COLUMN,
    LV_FLEX_FLOW_COLUMN_REVERSE,
    LV_FLEX_FLOW_COLUMN_WRAP,
    LV_FLEX_FLOW_COLUMN_WRAP_REVERSE,
    LV_FLEX_FLOW_ROW,
    LV_FLEX_FLOW_ROW_REVERSE,
    LV_FLEX_FLOW_ROW_WRAP,
    LV_FLEX_FLOW_ROW_WRAP_REVERSE,
    LV_GRID_ALIGN_CENTER,
    LV_GRID_ALIGN_END,
    LV_GRID_ALIGN_SPACE_AROUND,
    LV_GRID_ALIGN_SPACE_BETWEEN,
    LV_GRID_ALIGN_SPACE_EVENLY,
    LV_GRID_ALIGN_START,
    LV_GRID_ALIGN_STRETCH,
    LV_LAYOUT_FLEX,
    LV_LAYOUT_GRID,
    LV_LAYOUT_NONE
} from "project-editor/lvgl/lvgl-constants";
import { ProjectEditor } from "project-editor/project-editor-interface";
import { getEnumItems } from "project-editor/ui-components/PropertyGrid/utils";
import { settingsController } from "home/settings";
import { registerSystemEnum } from "project-editor/features/variable/value-type";
import { getLvglCoord } from "project-editor/lvgl/lvgl-versions";

////////////////////////////////////////////////////////////////////////////////

export const BUILT_IN_FONTS = [
    "MONTSERRAT_8",
    "MONTSERRAT_10",
    "MONTSERRAT_12",
    "MONTSERRAT_14",
    "MONTSERRAT_16",
    "MONTSERRAT_18",
    "MONTSERRAT_20",
    "MONTSERRAT_22",
    "MONTSERRAT_24",
    "MONTSERRAT_26",
    "MONTSERRAT_28",
    "MONTSERRAT_30",
    "MONTSERRAT_32",
    "MONTSERRAT_34",
    "MONTSERRAT_36",
    "MONTSERRAT_38",
    "MONTSERRAT_40",
    "MONTSERRAT_42",
    "MONTSERRAT_44",
    "MONTSERRAT_46",
    "MONTSERRAT_48"
];

////////////////////////////////////////////////////////////////////////////////

interface LVGLStyleProp {
    code: LVGLStylePropCode;
    description: string;
    defaultValue: string;
    inherited: boolean;
    layout: boolean;
    extDraw: boolean;
    valueRead?: (value: number) => string;
    valueToNum?: (value: string, projectStore: ProjectStore) => number | number[];
    valueBuild?: (value: string) => string;
    buildPrefix?: string;
    isInt16Array?: (projectStore: ProjectStore) => boolean;
}

export type LVGLPropertyInfo = PropertyInfo & {
    lvglStyleProp: LVGLStyleProp;
};

export class PropertyValueHolder extends EezObject {
    [propertyName: string]: any;
    constructor(
        public projectStore: ProjectStore,
        propertyName: string,
        propertyValue: any
    ) {
        super();
        this[propertyName] = propertyValue;
    }
}

////////////////////////////////////////////////////////////////////////////////

function makeEnumPropertyInfo(
    name: string,
    displayName: string,
    lvglStyleProp: LVGLStyleProp,
    enumItemToCodeOrStringArray: { [key: string]: number } | string[],
    buildPrefix: string,
    propertyGridColumnComponent?: React.ComponentType<PropertyProps>
): LVGLPropertyInfo {
    let enumItemToCode: { [key: string]: number };
    if (isArray(enumItemToCodeOrStringArray)) {
        enumItemToCode = {};
        for (let i = 0; i < enumItemToCodeOrStringArray.length; i++) {
            enumItemToCode[enumItemToCodeOrStringArray[i]] = i;
        }
    } else {
        enumItemToCode = enumItemToCodeOrStringArray;
    }

    //
    registerSystemEnum({
        name: buildPrefix.slice(0, -1),
        members: Object.keys(enumItemToCode).map((key) => ({
            name: key,
            value: enumItemToCode[key]
        })),
        projectTypes: [ProjectType.LVGL]
    });

    //
    const codeToEnumItem: { [code: string]: string } = {};

    Object.keys(enumItemToCode).forEach(
        enumItem =>
            (codeToEnumItem[enumItemToCode[enumItem].toString()] = enumItem)
    );

    return {
        name,
        displayName,
        type: PropertyType.Enum,
        enumItems: Object.keys(enumItemToCode).map(id => ({
            id,
            label: id
        })),
        enumDisallowUndefined: true,
        propertyGridColumnComponent,
        lvglStyleProp: Object.assign(lvglStyleProp, {
            buildPrefix,
            enumItemToCodeOrStringArray,
            valueRead: lvglStyleProp.valueRead
                ? lvglStyleProp.valueRead
                : (value: number) => codeToEnumItem[value.toString()],
            valueToNum: lvglStyleProp.valueToNum
                ? lvglStyleProp.valueToNum
                : (value: string) => enumItemToCode[value.toString()],
            valueBuild: lvglStyleProp.valueBuild
                ? lvglStyleProp.valueBuild
                : (value: string) => buildPrefix + value
        })
    };
}

////////////////////////////////////////////////////////////////////////////////

//
// POSITION AND SIZE
//

const width_property_info: LVGLPropertyInfo = {
    name: "width",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_WIDTH,
        description:
            "设置对象宽度。可使用像素、百分比和 LV_SIZE_CONTENT 值。百分比值相对于父对象内容区域的宽度。",
        defaultValue: "Widget dependent",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

const height_property_info: LVGLPropertyInfo = {
    name: "height",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_HEIGHT,
        description:
            "设置对象高度。可使用像素、百分比和 LV_SIZE_CONTENT。百分比值相对于父对象内容区域的高度。",
        defaultValue: "Widget dependent",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

const min_width_property_info: LVGLPropertyInfo = {
    name: "min_width",
    displayName: "最小宽度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_MIN_WIDTH,
        description:
            "设置最小宽度。可使用像素和百分比值。百分比值相对于父对象内容区域的宽度。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

const max_width_property_info: LVGLPropertyInfo = {
    name: "max_width",
    displayName: "最大宽度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_MAX_WIDTH,
        description:
            "设置最大宽度。可使用像素和百分比值。百分比值相对于父对象内容区域的宽度。",
        defaultValue: "LV_COORD_MAX",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

const min_height_property_info: LVGLPropertyInfo = {
    name: "min_height",
    displayName: "最小高度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_MIN_HEIGHT,
        description:
            "设置最小高度。可使用像素和百分比值。百分比值相对于父对象内容区域的宽度。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};
const max_height_property_info: LVGLPropertyInfo = {
    name: "max_height",
    displayName: "最大高度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_MAX_HEIGHT,
        description:
            "设置最大高度。可使用像素和百分比值。百分比值相对于父对象内容区域的高度。",
        defaultValue: "LV_COORD_MAX",
        inherited: false,
        layout: true,
        extDraw: false
    }
};
const length_property_info: LVGLPropertyInfo = {
    name: "length",
    displayName: "长度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_LENGTH,
        description: "",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

const x_property_info: LVGLPropertyInfo = {
    name: "x",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_X,
        description:
            "考虑所设对齐方式设置对象的 X 坐标。可使用像素和百分比值。百分比值相对于父对象内容区域的宽度。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

const y_property_info: LVGLPropertyInfo = {
    name: "y",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_Y,
        description:
            "考虑所设对齐方式设置对象的 Y 坐标。可使用像素和百分比值。百分比值相对于父对象内容区域的高度。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

const align_property_info = makeEnumPropertyInfo(
    "align",
    "Align",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_ALIGN,
        description:
            "设置对齐方式，决定 X 和 Y 坐标从父对象的哪个点开始计算。可选值为：LV_ALIGN_DEFAULT、LV_ALIGN_TOP_LEFT/MID/RIGHT、LV_ALIGN_BOTTOM_LEFT/MID/RIGHT、LV_ALIGN_LEFT/RIGHT_MID、LV_ALIGN_CENTER。LV_ALIGN_DEFAULT 在 LTR 基本方向下表示 LV_ALIGN_TOP_LEFT，在 RTL 基本方向下表示 LV_ALIGN_TOP_RIGHT。",
        defaultValue: "LV_ALIGN_DEFAULT",
        inherited: false,
        layout: true,
        extDraw: false
    },
    [
        "DEFAULT",
        "TOP_LEFT",
        "TOP_MID",
        "TOP_RIGHT",
        "BOTTOM_LEFT",
        "BOTTOM_MID",
        "BOTTOM_RIGHT",
        "LEFT_MID",
        "RIGHT_MID",
        "CENTER",

        "OUT_TOP_LEFT",
        "OUT_TOP_MID",
        "OUT_TOP_RIGHT",
        "OUT_BOTTOM_LEFT",
        "OUT_BOTTOM_MID",
        "OUT_BOTTOM_RIGHT",
        "OUT_LEFT_TOP",
        "OUT_LEFT_MID",
        "OUT_LEFT_BOTTOM",
        "OUT_RIGHT_TOP",
        "OUT_RIGHT_MID",
        "OUT_RIGHT_BOTTOM"
    ],
    "LV_ALIGN_"
);

const transform_width_property_info: LVGLPropertyInfo = {
    name: "transform_width",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TRANSFORM_WIDTH,
        description:
            "用此值在两侧增加对象宽度。可使用像素和百分比（通过 lv_pct(x)）值。百分比值相对于对象的宽度。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: true
    }
};

const transform_height_property_info: LVGLPropertyInfo = {
    name: "transform_height",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TRANSFORM_HEIGHT,
        description:
            "用此值在两侧增加对象高度。可使用像素和百分比（通过 lv_pct(x)）值。百分比值相对于对象的高度。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: true
    }
};

const translate_x_property_info: LVGLPropertyInfo = {
    name: "translate_x",
    displayName: "平移 X",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TRANSLATE_X,
        description:
            "用此值在 X 方向移动对象。在布局、对齐和其他定位之后应用。可使用像素和百分比（通过 lv_pct(x)）值。百分比值相对于对象的宽度。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

const translate_y_property_info: LVGLPropertyInfo = {
    name: "translate_y",
    displayName: "平移 Y",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TRANSLATE_Y,
        description:
            "用此值在 Y 方向移动对象。在布局、对齐和其他定位之后应用。可使用像素和百分比（通过 lv_pct(x)）值。百分比值相对于对象的高度。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

export const transform_zoom_property_info: LVGLPropertyInfo = {
    name: "transform_zoom",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TRANSFORM_ZOOM,
        description:
            "缩放对象。值 256（或 LV_IMG_ZOOM_NONE）表示正常大小，128 为一半大小，512 为两倍大小，依此类推",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

export const transform_scale_x_property_info: LVGLPropertyInfo = {
    name: "transform_scale_x",
    displayName: "变换缩放 X",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TRANSFORM_SCALE_X,
        description:
            "水平缩放对象。值 256（或 LV_IMG_ZOOM_NONE）表示正常大小，128 为一半大小，512 为两倍大小，依此类推",
        defaultValue: "1",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

export const transform_scale_y_property_info: LVGLPropertyInfo = {
    name: "transform_scale_y",
    displayName: "变换缩放 Y",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TRANSFORM_SCALE_Y,
        description:
            "垂直缩放对象。值 256（或 LV_IMG_ZOOM_NONE）表示正常大小，128 为一半大小，512 为两倍大小，依此类推",
        defaultValue: "1",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

export const transform_angle_property_info: LVGLPropertyInfo = {
    name: "transform_angle",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TRANSFORM_ANGLE,
        description:
            "旋转对象。数值以 0.1 度为单位。例如 450 表示 45 度。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

export const transform_rotation_property_info: LVGLPropertyInfo = {
    name: "transform_rotation",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TRANSFORM_ROTATION,
        description:
            "旋转对象。数值以 0.1 度为单位。例如 450 表示 45 度。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

const transform_pivot_x_property_info: LVGLPropertyInfo = {
    name: "transform_pivot_x",
    displayName: "变换枢轴 X",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TRANSFORM_PIVOT_X,
        description:
            "设置变换的枢轴点 X 坐标。相对于对象的左上角",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const transform_pivot_y_property_info: LVGLPropertyInfo = {
    name: "transform_pivot_y",
    displayName: "变换枢轴 Y",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TRANSFORM_PIVOT_Y,
        description:
            "设置变换的枢轴点 Y 坐标。相对于对象的左上角",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};

const transform_skew_x_property_info: LVGLPropertyInfo = {
    name: "transform_skew_x",
    displayName: "变换倾斜 X",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TRANSFORM_SKEW_X,
        description: "",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const transform_skew_y_property_info: LVGLPropertyInfo = {
    name: "transform_skew_y",
    displayName: "变换倾斜 Y",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TRANSFORM_SKEW_Y,
        description: "",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};

//
// LAYOUT
//

const layout_property_info = makeEnumPropertyInfo(
    "layout",
    "Layout",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_LAYOUT,
        description:
            "设置对象的布局。子项将根据布局设置的策略重新定位和调整大小。可选值请参见布局文档。",
        defaultValue: "LV_FLEX_FLOW_ROW",
        inherited: false,
        layout: true,
        extDraw: false
    },
    {
        NONE: LV_LAYOUT_NONE, // No layout
        FLEX: LV_LAYOUT_FLEX, // Use flex layout
        GRID: LV_LAYOUT_GRID // Use grid layout
    },
    "LV_LAYOUT_"
);

const flex_flow_property_info = makeEnumPropertyInfo(
    "flex_flow",
    "Flex flow",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_FLEX_FLOW,
        description: "决定所用 Flex 布局类型",
        defaultValue: "LV_FLEX_FLOW_ROW",
        inherited: false,
        layout: true,
        extDraw: false
    },
    {
        ROW: LV_FLEX_FLOW_ROW, // Place the children in a row without wrapping
        COLUMN: LV_FLEX_FLOW_COLUMN, // Place the children in a column without wrapping
        ROW_WRAP: LV_FLEX_FLOW_ROW_WRAP, // Place the children in a row with wrapping
        ROW_REVERSE: LV_FLEX_FLOW_ROW_REVERSE, // Place the children in a column with wrapping
        ROW_WRAP_REVERSE: LV_FLEX_FLOW_ROW_WRAP_REVERSE, // Place the children in a row without wrapping but in reversed order
        COLUMN_WRAP: LV_FLEX_FLOW_COLUMN_WRAP, // Place the children in a column without wrapping but in reversed order
        COLUMN_REVERSE: LV_FLEX_FLOW_COLUMN_REVERSE, // Place the children in a row with wrapping but in reversed order
        COLUMN_WRAP_REVERSE: LV_FLEX_FLOW_COLUMN_WRAP_REVERSE // Place the children in a column with wrapping but in reversed order
    },
    "LV_FLEX_FLOW_"
);

const flex_main_place_property_info = makeEnumPropertyInfo(
    "flex_main_place",
    "Flex main place",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_FLEX_MAIN_PLACE,
        description:
            "决定项目在主轴上如何分布。",
        defaultValue: "LV_FLEX_ALIGN_START",
        inherited: false,
        layout: true,
        extDraw: false
    },
    {
        START: LV_FLEX_ALIGN_START, // means left on a horizontally and top vertically (default)
        END: LV_FLEX_ALIGN_END, // means right on a horizontally and bottom vertically
        CENTER: LV_FLEX_ALIGN_CENTER, // simply center
        SPACE_EVENLY: LV_FLEX_ALIGN_SPACE_EVENLY, // items are distributed so that the spacing between any two items (and the space to the edges) is equal. Does not apply to track_cross_place.
        SPACE_AROUND: LV_FLEX_ALIGN_SPACE_AROUND, // items are evenly distributed in the track with equal space around them. Note that visually the spaces aren't equal, since all the items have equal space on both sides. The first item will have one unit of space against the container edge, but two units of space between the next item because that next item has its own spacing that applies. Not applies to track_cross_place.
        SPACE_BETWEEN: LV_FLEX_ALIGN_SPACE_BETWEEN // items are evenly distributed in the track: first item is on the start line, last item on the end line. Not applies to track_cross_place.
    },
    "LV_FLEX_ALIGN_"
);

const flex_cross_place_property_info = makeEnumPropertyInfo(
    "flex_cross_place",
    "Flex cross place",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_FLEX_CROSS_PLACE,
        description:
            "决定项目在交叉轴上如何分布。",
        defaultValue: "LV_FLEX_ALIGN_START",
        inherited: false,
        layout: true,
        extDraw: false
    },
    {
        START: LV_FLEX_ALIGN_START, // means left on a horizontally and top vertically (default)
        END: LV_FLEX_ALIGN_END, // means right on a horizontally and bottom vertically
        CENTER: LV_FLEX_ALIGN_CENTER // simply center
    },
    "LV_FLEX_ALIGN_"
);

const flex_track_place_property_info = makeEnumPropertyInfo(
    "flex_track_place",
    "Flex track place",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_FLEX_TRACK_PLACE,
        description: "决定如何分布轨道",
        defaultValue: "LV_FLEX_ALIGN_START",
        inherited: false,
        layout: true,
        extDraw: false
    },
    {
        START: LV_FLEX_ALIGN_START, // means left on a horizontally and top vertically (default)
        END: LV_FLEX_ALIGN_END, // means right on a horizontally and bottom vertically
        CENTER: LV_FLEX_ALIGN_CENTER, // simply center
        SPACE_EVENLY: LV_FLEX_ALIGN_SPACE_EVENLY, // items are distributed so that the spacing between any two items (and the space to the edges) is equal. Does not apply to track_cross_place.
        SPACE_AROUND: LV_FLEX_ALIGN_SPACE_AROUND, // items are evenly distributed in the track with equal space around them. Note that visually the spaces aren't equal, since all the items have equal space on both sides. The first item will have one unit of space against the container edge, but two units of space between the next item because that next item has its own spacing that applies. Not applies to track_cross_place.
        SPACE_BETWEEN: LV_FLEX_ALIGN_SPACE_BETWEEN // items are evenly distributed in the track: first item is on the start line, last item on the end line. Not applies to track_cross_place.
    },
    "LV_FLEX_ALIGN_"
);

const flex_grow_property_info: LVGLPropertyInfo = {
    name: "flex_grow",
    displayName: "Flex 增长",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_FLEX_GROW,
        description:
            "Flex grow 可用于让一个或多个子项填充轨道上的可用空间。当多个子项具有 grow 参数时，可用空间将按 grow 值成比例分配。",
        defaultValue: "1",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

const grid_column_align_property_info: LVGLPropertyInfo = makeEnumPropertyInfo(
    "grid_column_align",
    "Grid column align",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_GRID_COLUMN_ALIGN,
        description: "定义如何分布列。",
        defaultValue: "1",
        inherited: false,
        layout: true,
        extDraw: false
    },
    {
        START: LV_GRID_ALIGN_START,
        CENTER: LV_GRID_ALIGN_CENTER,
        END: LV_GRID_ALIGN_END,
        STRETCH: LV_GRID_ALIGN_STRETCH,
        SPACE_EVENLY: LV_GRID_ALIGN_SPACE_EVENLY,
        SPACE_AROUND: LV_GRID_ALIGN_SPACE_AROUND,
        SPACE_BETWEEN: LV_GRID_ALIGN_SPACE_BETWEEN
    },
    "LV_GRID_ALIGN_"
);

const grid_row_align_property_info: LVGLPropertyInfo = makeEnumPropertyInfo(
    "grid_row_align",
    "Grid row align",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_GRID_ROW_ALIGN,
        description: "定义如何分布列。",
        defaultValue: "1",
        inherited: false,
        layout: true,
        extDraw: false
    },
    {
        START: LV_GRID_ALIGN_START,
        CENTER: LV_GRID_ALIGN_CENTER,
        END: LV_GRID_ALIGN_END,
        STRETCH: LV_GRID_ALIGN_STRETCH,
        SPACE_EVENLY: LV_GRID_ALIGN_SPACE_EVENLY,
        SPACE_AROUND: LV_GRID_ALIGN_SPACE_AROUND,
        SPACE_BETWEEN: LV_GRID_ALIGN_SPACE_BETWEEN
    },
    "LV_GRID_ALIGN_"
);

function dscArrayValueRead(value: number) {
    return "";
}

function dscArrayValueToNum(value: string, projectStore: ProjectStore) {
    const { LV_COORD_MAX } = getLvglCoord(projectStore.project);
    const LV_GRID_CONTENT = LV_COORD_MAX - 101;
    function LV_GRID_FR(x: number) {
        return LV_COORD_MAX - 100 + x;
    }
    const LV_GRID_TEMPLATE_LAST = LV_COORD_MAX;

    let arrStr = value.trim().split(value.indexOf(",") !== -1 ? "," : " ");
    let arr: number[] = [];

    for (let i = 0; i < arrStr.length; i++) {
        const colStr = arrStr[i].trim().toUpperCase();
        if (colStr.startsWith("FR(") && colStr.endsWith(")")) {
            const fr = colStr.slice(3, -1);
            const frNum = Number(fr);
            if (Number.isInteger(frNum)) {
                if (frNum != 0) {
                    arr.push(LV_GRID_FR(frNum));
                } else {
                    arr.push(0);
                }
            } else {
                arr.push(0);
            }
        } else if (colStr === "CONTENT") {
            arr.push(LV_GRID_CONTENT);
        } else {
            const col = Number(colStr);
            if (Number.isInteger(col)) {
                arr.push(col);
            } else {
                arr.push(0);
            }
        }
    }

    arr.push(LV_GRID_TEMPLATE_LAST);

    return arr;
}

function dscArrayValueBuild(value: string) {
    let arrStr = value.split(value.indexOf(",") !== -1 ? "," : " ");

    let resultArr: string[] = [];

    for (let i = 0; i < arrStr.length; i++) {
        const colStr = arrStr[i].trim().toUpperCase();
        if (colStr.startsWith("FR(") && colStr.endsWith(")")) {
            const fr = colStr.slice(3, -1);
            const frNum = Number(fr);
            if (Number.isInteger(frNum)) {
                if (frNum != 0) {
                    resultArr.push(`LV_GRID_FR(${frNum})`);
                } else {
                    resultArr.push("0");
                }
            } else {
                resultArr.push("0");
            }
        } else if (colStr === "CONTENT") {
            resultArr.push("LV_GRID_CONTENT");
        } else {
            const col = Number(colStr);
            if (Number.isInteger(col)) {
                resultArr.push(col.toString());
            } else {
                resultArr.push("0");
            }
        }
    }

    resultArr.push("LV_GRID_TEMPLATE_LAST");

    return resultArr.join(", ");
}

function dscArrayIsInt16(projectStore: ProjectStore) {
    return projectStore.project.settings.general.lvglVersion.startsWith("8.");
}

export const grid_row_dsc_array_property_info: LVGLPropertyInfo = {
    name: "grid_row_dsc_array",
    displayName: "网格行描述符",
    type: PropertyType.NumberArrayAsString,
    formText: "Defines the size of grid rows as a comma or space-separated list of values. Options: fixed value in pixels (e.g. 50), FR(x) (e.g. FR(1), FR(2), etc.) or CONTENT.",
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_GRID_ROW_DSC_ARRAY,
        description:
            "描述网格行的数组。应以 LV_GRID_TEMPLATE_LAST 结尾。",
        defaultValue: "1",
        inherited: false,
        layout: true,
        extDraw: false,
        valueRead: dscArrayValueRead,
        valueToNum: dscArrayValueToNum,
        valueBuild: dscArrayValueBuild,
        isInt16Array: dscArrayIsInt16
    }
};

export const grid_column_dsc_array_property_info: LVGLPropertyInfo = {
    name: "grid_column_dsc_array",
    displayName: "网格列描述符",
    type: PropertyType.NumberArrayAsString,
    formText: "Defines the size of grid columns as a comma or space-separated list of values. Options: fixed value in pixels (e.g. 50), FR(x) (e.g. FR(1), FR(2), etc.) or CONTENT. ",
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_GRID_COLUMN_DSC_ARRAY,
        description:
            "描述网格列的数组。应以 LV_GRID_TEMPLATE_LAST 结尾。",
        defaultValue: "1",
        inherited: false,
        layout: true,
        extDraw: false,
        valueRead: dscArrayValueRead,
        valueToNum: dscArrayValueToNum,
        valueBuild: dscArrayValueBuild,
        isInt16Array: dscArrayIsInt16
    }
};

export const grid_cell_column_pos_property_info: LVGLPropertyInfo = {
    name: "grid_cell_column_pos",
    displayName: "网格单元格列位置",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_GRID_CELL_COLUMN_POS,
        description: "设置对象应放置的列。",
        defaultValue: "1",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

export const grid_cell_column_span_property_info: LVGLPropertyInfo = {
    name: "grid_cell_column_span",
    displayName: "网格单元格列跨度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_GRID_CELL_COLUMN_SPAN,
        description:
            "设置对象应跨越的列数。需 >= 1。",
        defaultValue: "1",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

const grid_cell_x_align_property_info: LVGLPropertyInfo = makeEnumPropertyInfo(
    "grid_cell_x_align",
    "Grid cell X align",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_GRID_CELL_X_ALIGN,
        description: "设置对象的水平对齐方式。",
        defaultValue: "1",
        inherited: false,
        layout: true,
        extDraw: false
    },
    {
        START: LV_GRID_ALIGN_START,
        CENTER: LV_GRID_ALIGN_CENTER,
        END: LV_GRID_ALIGN_END,
        STRETCH: LV_GRID_ALIGN_STRETCH,
        SPACE_EVENLY: LV_GRID_ALIGN_SPACE_EVENLY,
        SPACE_AROUND: LV_GRID_ALIGN_SPACE_AROUND,
        SPACE_BETWEEN: LV_GRID_ALIGN_SPACE_BETWEEN
    },
    "LV_GRID_ALIGN_"
);

export const grid_cell_row_pos_property_info: LVGLPropertyInfo = {
    name: "grid_cell_row_pos",
    displayName: "网格单元格行位置",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_GRID_CELL_ROW_POS,
        description: "设置对象应放置的行。",
        defaultValue: "1",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

export const grid_cell_row_span_property_info: LVGLPropertyInfo = {
    name: "grid_cell_row_span",
    displayName: "网格单元格行跨度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_GRID_CELL_ROW_SPAN,
        description:
            "设置对象应跨越的行数。需 >= 1",
        defaultValue: "1",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

const grid_cell_y_align_property_info: LVGLPropertyInfo = makeEnumPropertyInfo(
    "grid_cell_y_align",
    "Grid cell Y align",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_GRID_CELL_Y_ALIGN,
        description: "设置对象的垂直对齐方式。",
        defaultValue: "1",
        inherited: false,
        layout: true,
        extDraw: false
    },
    {
        START: LV_GRID_ALIGN_START,
        CENTER: LV_GRID_ALIGN_CENTER,
        END: LV_GRID_ALIGN_END,
        STRETCH: LV_GRID_ALIGN_STRETCH,
        SPACE_EVENLY: LV_GRID_ALIGN_SPACE_EVENLY,
        SPACE_AROUND: LV_GRID_ALIGN_SPACE_AROUND,
        SPACE_BETWEEN: LV_GRID_ALIGN_SPACE_BETWEEN
    },
    "LV_GRID_ALIGN_"
);

//
// PADDING
//

export const pad_top_property_info: LVGLPropertyInfo = {
    name: "pad_top",
    displayName: "顶部内边距",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_PAD_TOP,
        description:
            "设置顶部内边距。它使内容区域在此方向上变小。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};
export const pad_bottom_property_info: LVGLPropertyInfo = {
    name: "pad_bottom",
    displayName: "底部内边距",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_PAD_BOTTOM,
        description:
            "设置底部内边距。它使内容区域在此方向上变小。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};
export const pad_left_property_info: LVGLPropertyInfo = {
    name: "pad_left",
    displayName: "左侧内边距",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_PAD_LEFT,
        description:
            "设置左侧内边距。它使内容区域在此方向上变小。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};
export const pad_right_property_info: LVGLPropertyInfo = {
    name: "pad_right",
    displayName: "右侧内边距",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_PAD_RIGHT,
        description:
            "设置右侧内边距。它使内容区域在此方向上变小。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};
const pad_radial_property_info: LVGLPropertyInfo = {
    name: "pad_radial",
    displayName: "径向内边距",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_PAD_RADIAL,
        description: "使文本标签与刻度保持间距。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const pad_row_property_info: LVGLPropertyInfo = {
    name: "pad_row",
    displayName: "行内边距",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_PAD_ROW,
        description: "设置行之间的内边距。供布局使用。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};
const pad_column_property_info: LVGLPropertyInfo = {
    name: "pad_column",
    displayName: "列内边距",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_PAD_COLUMN,
        description:
            "设置列之间的内边距。供布局使用。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

//
// MARGIN
//
const margin_top_property_info: LVGLPropertyInfo = {
    name: "margin_top",
    displayName: "顶部外边距",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_MARGIN_TOP,
        description:
            "设置顶部外边距。对象在布局中将与同级对象保持此间距。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};
const margin_bottom_property_info: LVGLPropertyInfo = {
    name: "margin_bottom",
    displayName: "底部外边距",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_MARGIN_BOTTOM,
        description:
            "设置底部外边距。对象在布局中将与同级对象保持此间距。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};
const margin_left_property_info: LVGLPropertyInfo = {
    name: "margin_left",
    displayName: "左侧外边距",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_MARGIN_LEFT,
        description:
            "设置左侧外边距。对象在布局中将与同级对象保持此间距。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};
const margin_right_property_info: LVGLPropertyInfo = {
    name: "margin_right",
    displayName: "右侧外边距",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_MARGIN_RIGHT,
        description:
            "设置右侧外边距。对象在布局中将与同级对象保持此间距。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

//
// BACKGROUND
//

const bg_color_property_info: LVGLPropertyInfo = {
    name: "bg_color",
    displayName: "背景颜色",
    type: PropertyType.ThemedColor,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_COLOR,
        description: "设置对象的背景颜色。",
        defaultValue: "0xffffff",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
export const bg_opa_property_info: LVGLPropertyInfo = {
    name: "bg_opa",
    displayName: "背景不透明度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_OPA,
        description:
            "设置背景的不透明度。值 0、LV_OPA_0 或 LV_OPA_TRANSP 表示完全透明，255、LV_OPA_100 或 LV_OPA_COVER 表示完全不透明，其他值或 LV_OPA_10、LV_OPA_20 等表示半透明。",
        defaultValue: "LV_OPA_TRANSP",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const bg_grad_color_property_info: LVGLPropertyInfo = {
    name: "bg_grad_color",
    displayName: "背景渐变颜色",
    type: PropertyType.ThemedColor,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_GRAD_COLOR,
        description:
            "设置背景的渐变颜色。仅在 grad_dir 不是 LV_GRAD_DIR_NONE 时使用",
        defaultValue: "0x000000",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const bg_grad_dir_property_info = makeEnumPropertyInfo(
    "bg_grad_dir",
    "Bg Grad. Direction",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_GRAD_DIR,
        description:
            "设置背景渐变的方向。可选值为 LV_GRAD_DIR_NONE/HOR/VER。",
        defaultValue: "LV_GRAD_DIR_NONE",
        inherited: false,
        layout: false,
        extDraw: false
    },
    [
        "NONE", // No gradient (the `grad_color` property is ignored)
        "VER", // Vertical (top to bottom) gradient
        "HOR" // Horizontal (left to right) gradient
    ],
    "LV_GRAD_DIR_"
);
const bg_main_stop_property_info: LVGLPropertyInfo = {
    name: "bg_main_stop",
    displayName: "背景主停止点",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_MAIN_STOP,
        description:
            "设置渐变中背景颜色的起始点。0 表示顶部/左侧，255 表示底部/右侧，128 表示中心，依此类推",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const bg_grad_stop_property_info: LVGLPropertyInfo = {
    name: "bg_grad_stop",
    displayName: "背景渐变停止点",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_GRAD_STOP,
        description:
            "设置背景渐变颜色的起始点。0 表示顶部/左侧，255 表示底部/右侧，128 表示中心，依此类推",
        defaultValue: "255",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const bg_main_opa_property_info: LVGLPropertyInfo = {
    name: "bg_main_opa",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_MAIN_OPA,
        description: "",
        defaultValue: "LV_OPA_COVER",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const bg_grad_opa_property_info: LVGLPropertyInfo = {
    name: "bg_grad_opa",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_GRAD_OPA,
        description: "",
        defaultValue: "LV_OPA_COVER",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const bg_grad_property_info: LVGLPropertyInfo = {
    name: "bg_grad",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_GRAD,
        description:
            "设置渐变定义。被指向的实例必须在对象存活期间存在。NULL 表示禁用。它将 BG_GRAD_COLOR、BG_GRAD_DIR、BG_MAIN_STOP 和 BG_GRAD_STOP 封装到一个描述符中，也允许创建更多颜色的渐变。",
        defaultValue: "NULL",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const bg_dither_mode_property_info = makeEnumPropertyInfo(
    "bg_dither_mode",
    "Bg Dither mode",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_DITHER_MODE,
        description:
            "设置背景渐变的抖动模式。可选值为 LV_DITHER_NONE/ORDERED/ERR_DIFF。",
        defaultValue: "LV_DITHER_NONE",
        inherited: false,
        layout: false,
        extDraw: false
    },
    [
        "NONE", // No dithering, colors are just quantized to the output resolution
        "ORDERED", // Ordered dithering. Faster to compute and use less memory but lower quality
        "ERR_DIFF" // Error diffusion mode. Slower to compute and use more memory but give highest dither quality
    ],
    "LV_DITHER_"
);
const bg_img_src_property_info: LVGLPropertyInfo = {
    name: "bg_img_src",
    displayName: "背景图像源",
    type: PropertyType.ObjectReference,
    referencedObjectCollectionPath: "bitmaps",
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_IMG_SRC,
        description:
            "设置背景图像。可以是指向 lv_img_dsc_t 的指针、文件路径或 LV_SYMBOL_...",
        defaultValue: "NULL",
        inherited: false,
        layout: false,
        extDraw: true
    }
};
const bg_img_opa_property_info: LVGLPropertyInfo = {
    name: "bg_img_opa",
    displayName: "背景图像不透明度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_IMG_OPA,
        description:
            "设置背景图像的不透明度。值 0、LV_OPA_0 或 LV_OPA_TRANSP 表示完全透明，255、LV_OPA_100 或 LV_OPA_COVER 表示完全不透明，其他值或 LV_OPA_10、LV_OPA_20 等表示半透明。",
        defaultValue: "LV_OPA_COVER",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const bg_img_recolor_property_info: LVGLPropertyInfo = {
    name: "bg_img_recolor",
    displayName: "背景图像重新着色",
    type: PropertyType.ThemedColor,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_IMG_RECOLOR,
        description: "设置与背景图像混合的颜色。",
        defaultValue: "0x000000",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const bg_img_recolor_opa_property_info: LVGLPropertyInfo = {
    name: "bg_img_recolor_opa",
    displayName: "背景图像重新着色不透明度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_IMG_RECOLOR_OPA,
        description:
            "设置背景图像重新着色的强度。值 0、LV_OPA_0 或 LV_OPA_TRANSP 表示不混合，255、LV_OPA_100 或 LV_OPA_COVER 表示完全重新着色，其他值或 LV_OPA_10、LV_OPA_20 等按比例解释。",
        defaultValue: "LV_OPA_TRANSP",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const bg_img_tiled_property_info: LVGLPropertyInfo = {
    name: "bg_img_tiled",
    displayName: "背景图像平铺",
    type: PropertyType.Boolean,
    checkboxStyleSwitch: true,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BG_IMG_TILED,
        description:
            "启用后背景图像将平铺。可选值为 true 或 false。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};

//
// BORDER
//

const border_color_property_info: LVGLPropertyInfo = {
    name: "border_color",
    displayName: "边框颜色",
    type: PropertyType.ThemedColor,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BORDER_COLOR,
        description: "设置边框颜色",
        defaultValue: "0x000000",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const border_opa_property_info: LVGLPropertyInfo = {
    name: "border_opa",
    displayName: "边框不透明度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BORDER_OPA,
        description:
            "设置边框的不透明度。值 0、LV_OPA_0 或 LV_OPA_TRANSP 表示完全透明，255、LV_OPA_100 或 LV_OPA_COVER 表示完全不透明，其他值或 LV_OPA_10、LV_OPA_20 等表示半透明。",
        defaultValue: "LV_OPA_COVER",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
export const border_width_property_info: LVGLPropertyInfo = {
    name: "border_width",
    displayName: "边框宽度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BORDER_WIDTH,
        description:
            "设置边框宽度。只能使用像素值。",
        defaultValue: "0",
        inherited: false,
        layout: true,
        extDraw: false
    }
};

const BorderSide = observer(
    class BorderSide extends React.Component<PropertyProps> {
        changeValue(newValue: any) {
            this.props.updateObject({
                [this.props.propertyInfo.name]: newValue
            });
        }

        render() {
            const { objects, propertyInfo, readOnly } = this.props;

            let enumItems: EnumItem[];

            if (propertyInfo.enumItems) {
                enumItems = getEnumItems(this.props.objects, propertyInfo);
            } else {
                enumItems = [];
            }

            const options = enumItems.map(enumItem => ({
                value: enumItem.id.toString(),
                label: (enumItem.label || enumItem.id).toString()
            }));

            let propertyValue = (objects[0] as any)[propertyInfo.name];
            for (let i = 1; i < objects.length; i++) {
                if ((objects[i] as any)[propertyInfo.name] != propertyValue) {
                    propertyValue = undefined;
                }
            }

            let selectedValues: any;
            let isMulti = false;

            if (propertyValue != undefined) {
                if (propertyValue == "NONE") {
                    selectedValues = [options[0]];
                } else if (propertyValue == "FULL") {
                    selectedValues = [options[5]];
                } else if (propertyValue == "INTERNAL") {
                    selectedValues = [options[6]];
                } else {
                    selectedValues = [];

                    propertyValue
                        .toString()
                        .split("|")
                        .forEach((part: string) => {
                            if (part == "BOTTOM") {
                                selectedValues.push(options[1]);
                            } else if (part == "TOP") {
                                selectedValues.push(options[2]);
                            } else if (part == "LEFT") {
                                selectedValues.push(options[3]);
                            } else if (part == "RIGHT") {
                                selectedValues.push(options[4]);
                            }
                        });

                    isMulti = true;
                }
            } else {
                selectedValues = [];
            }

            settingsController.isDarkTheme;

            return (
                <Select
                    options={options}
                    isMulti={isMulti}
                    onChange={selectedValues => {
                        if (!Array.isArray(selectedValues)) {
                            selectedValues = [selectedValues];
                        }

                        let propertyValue = "";

                        if (selectedValues.length == 0) {
                            propertyValue = "NONE";
                        } else if (
                            selectedValues[selectedValues.length - 1].value ==
                            "NONE"
                        ) {
                            propertyValue = "NONE";
                        } else if (
                            selectedValues[selectedValues.length - 1].value ==
                            "FULL"
                        ) {
                            propertyValue = "FULL";
                        } else if (
                            selectedValues[selectedValues.length - 1].value ==
                            "INTERNAL"
                        ) {
                            propertyValue = "INTERNAL";
                        } else {
                            for (let i = 0; i < selectedValues.length; i++) {
                                if (
                                    selectedValues[i].value == "BOTTOM" ||
                                    selectedValues[i].value == "TOP" ||
                                    selectedValues[i].value == "LEFT" ||
                                    selectedValues[i].value == "RIGHT"
                                ) {
                                    propertyValue =
                                        (propertyValue
                                            ? propertyValue + "|"
                                            : "") + selectedValues[i].value;
                                }
                            }
                        }

                        if (!propertyValue) {
                            propertyValue = "NONE";
                        }

                        this.changeValue(propertyValue);
                    }}
                    isDisabled={readOnly}
                    isClearable={false}
                    value={selectedValues}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    theme={theme => {
                        return {
                            ...theme,
                            colors: {
                                ...theme.colors,

                                danger: "#DE350B",
                                dangerLight: "#FFBDAD",

                                ...(settingsController.isDarkTheme
                                    ? {
                                          neutral0: "hsl(0, 0%, 10%)",
                                          neutral5: "hsl(0, 0%, 20%)",
                                          neutral10: "hsl(0, 0%, 30%)",
                                          neutral20: "hsl(0, 0%, 40%)",
                                          neutral30: "hsl(0, 0%, 50%)",
                                          neutral40: "hsl(0, 0%, 60%)",
                                          neutral50: "hsl(0, 0%, 70%)",
                                          neutral60: "hsl(0, 0%, 80%)",
                                          neutral70: "hsl(0, 0%, 90%)",
                                          neutral80: "hsl(0, 0%, 95%)",
                                          neutral90: "hsl(0, 0%, 100%)"
                                      }
                                    : {
                                          neutral0: "hsl(0, 0%, 100%)",
                                          neutral5: "hsl(0, 0%, 95%)",
                                          neutral10: "hsl(0, 0%, 90%)",
                                          neutral20: "hsl(0, 0%, 80%)",
                                          neutral30: "hsl(0, 0%, 70%)",
                                          neutral40: "hsl(0, 0%, 60%)",
                                          neutral50: "hsl(0, 0%, 50%)",
                                          neutral60: "hsl(0, 0%, 40%)",
                                          neutral70: "hsl(0, 0%, 30%)",
                                          neutral80: "hsl(0, 0%, 20%)",
                                          neutral90: "hsl(0, 0%, 10%)"
                                      }),

                                primary: "#2684FF",
                                primary25: "#DEEBFF",
                                primary50: "#B2D4FF",
                                primary75: "#4C9AFF"
                            }
                        };
                    }}
                    styles={{
                        option: (baseStyles, state) => ({
                            ...baseStyles,
                            ...(settingsController.isDarkTheme &&
                            state.isFocused
                                ? { color: "#333" }
                                : {})
                        })
                    }}
                />
            );
        }
    }
);

const border_side_property_info = makeEnumPropertyInfo(
    "border_side",
    "Border Side",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BORDER_SIDE,
        description:
            "设置边框绘制的一侧或多侧。可选值为 LV_BORDER_SIDE_NONE/TOP/BOTTOM/LEFT/RIGHT/INTERNAL。也可使用按位或组合的值，例如 LV_BORDER_SIDE_TOP | LV_BORDER_SIDE_LEFT。",
        defaultValue: "LV_BORDER_SIDE_NONE",
        inherited: false,
        layout: false,
        extDraw: false,

        valueRead: (value: number) => {
            if (value == 0x00) {
                return "NONE";
            }

            if (value == 0x0f) {
                return "FULL";
            }

            if (value == 0x10) {
                return "INTERNAL";
            }

            let propertyValue = "";

            if (value & 0x01) {
                propertyValue =
                    (propertyValue ? propertyValue + "|" : "") + "BOTTOM";
            }

            if (value & 0x02) {
                propertyValue =
                    (propertyValue ? propertyValue + "|" : "") + "TOP";
            }

            if (value & 0x04) {
                propertyValue =
                    (propertyValue ? propertyValue + "|" : "") + "LEFT";
            }

            if (value & 0x08) {
                propertyValue =
                    (propertyValue ? propertyValue + "|" : "") + "RIGHT";
            }

            return propertyValue;
        },
        valueToNum: (value: string) => {
            if (value == "NONE") {
                return 0;
            }

            if (value == "FULL") {
                return 0x0f;
            }

            if (value == "INTERNAL") {
                return 0x10;
            }

            let num = 0;

            if (value.indexOf("BOTTOM") != -1) {
                num |= 0x01;
            }

            if (value.indexOf("TOP") != -1) {
                num |= 0x02;
            }

            if (value.indexOf("LEFT") != -1) {
                num |= 0x04;
            }

            if (value.indexOf("RIGHT") != -1) {
                num |= 0x08;
            }

            return num;
        },
        valueBuild: (value: string) => {
            if (value == "NONE") {
                return "LV_BORDER_SIDE_NONE";
            }

            if (value == "FULL") {
                return "LV_BORDER_SIDE_FULL";
            }

            if (value == "INTERNAL") {
                return "LV_BORDER_SIDE_INTERNAL";
            }

            let build = "";

            if (value.indexOf("BOTTOM") != -1) {
                build = (build ? build + "|" : "") + "LV_BORDER_SIDE_BOTTOM";
            }

            if (value.indexOf("TOP") != -1) {
                build = (build ? build + "|" : "") + "LV_BORDER_SIDE_TOP";
            }

            if (value.indexOf("LEFT") != -1) {
                build = (build ? build + "|" : "") + "LV_BORDER_SIDE_LEFT";
            }

            if (value.indexOf("RIGHT") != -1) {
                build = (build ? build + "|" : "") + "LV_BORDER_SIDE_RIGHT";
            }

            return build;
        }
    },
    {
        NONE: 0x00,
        BOTTOM: 0x01,
        TOP: 0x02,
        LEFT: 0x04,
        RIGHT: 0x08,
        FULL: 0x0f,
        INTERNAL: 0x10 // FOR matrix-like objects (e.g. Button matrix)
    },
    "LV_BORDER_SIDE_",
    BorderSide
);

const border_post_property_info: LVGLPropertyInfo = {
    name: "border_post",
    displayName: "边框后置",
    type: PropertyType.Boolean,
    checkboxStyleSwitch: true,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BORDER_POST,
        description:
            "设置边框在子项绘制之前还是之后绘制。true：子项之后，false：子项之前",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};

//
// OUTLINE
//

const outline_width_property_info: LVGLPropertyInfo = {
    name: "outline_width",
    displayName: "轮廓宽度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_OUTLINE_WIDTH,
        description: "以像素设置轮廓宽度。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: true
    }
};
const outline_color_property_info: LVGLPropertyInfo = {
    name: "outline_color",
    displayName: "轮廓颜色",
    type: PropertyType.ThemedColor,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_OUTLINE_COLOR,
        description: "设置轮廓颜色。",
        defaultValue: "0x000000",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const outline_opa_property_info: LVGLPropertyInfo = {
    name: "outline_opa",
    displayName: "轮廓不透明度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_OUTLINE_OPA,
        description:
            "设置轮廓的不透明度。值 0、LV_OPA_0 或 LV_OPA_TRANSP 表示完全透明，255、LV_OPA_100 或 LV_OPA_COVER 表示完全不透明，其他值或 LV_OPA_10、LV_OPA_20 等表示半透明。",
        defaultValue: "LV_OPA_COVER",
        inherited: false,
        layout: false,
        extDraw: true
    }
};
const outline_pad_property_info: LVGLPropertyInfo = {
    name: "outline_pad",
    displayName: "轮廓内边距",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_OUTLINE_PAD,
        description:
            "设置轮廓的内边距，即对象与轮廓之间的间隙。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: true
    }
};

//
// SHADOW
//

const shadow_width_property_info: LVGLPropertyInfo = {
    name: "shadow_width",
    displayName: "阴影宽度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_SHADOW_WIDTH,
        description:
            "以像素设置阴影宽度。值应 >= 0。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: true
    }
};
const shadow_ofs_x_property_info: LVGLPropertyInfo = {
    name: "shadow_ofs_x",
    displayName: "阴影 X 偏移",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_SHADOW_OFS_X,
        description: "设置阴影在 X 方向的像素偏移。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: true
    }
};
const shadow_ofs_y_property_info: LVGLPropertyInfo = {
    name: "shadow_ofs_y",
    displayName: "阴影 Y 偏移",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_SHADOW_OFS_Y,
        description: "设置阴影在 Y 方向的像素偏移。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: true
    }
};
const shadow_spread_property_info: LVGLPropertyInfo = {
    name: "shadow_spread",
    displayName: "阴影扩展",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_SHADOW_SPREAD,
        description:
            "使阴影计算使用更大或更小的矩形作为基础。该值可以用像素表示以使区域变大/变小",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: true
    }
};
const shadow_color_property_info: LVGLPropertyInfo = {
    name: "shadow_color",
    displayName: "阴影颜色",
    type: PropertyType.ThemedColor,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_SHADOW_COLOR,
        description: "设置阴影颜色",
        defaultValue: "0x000000",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const shadow_opa_property_info: LVGLPropertyInfo = {
    name: "shadow_opa",
    displayName: "阴影不透明度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_SHADOW_OPA,
        description:
            "设置阴影的不透明度。值 0、LV_OPA_0 或 LV_OPA_TRANSP 表示完全透明，255、LV_OPA_100 或 LV_OPA_COVER 表示完全不透明，其他值或 LV_OPA_10、LV_OPA_20 等表示半透明。",
        defaultValue: "LV_OPA_COVER",
        inherited: false,
        layout: false,
        extDraw: true
    }
};

//
// IMAGE
//

const img_opa_property_info: LVGLPropertyInfo = {
    name: "img_opa",
    displayName: "图像不透明度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_IMG_OPA,
        description:
            "设置图像的不透明度。值 0、LV_OPA_0 或 LV_OPA_TRANSP 表示完全透明，255、LV_OPA_100 或 LV_OPA_COVER 表示完全不透明，其他值或 LV_OPA_10、LV_OPA_20 等表示半透明。",
        defaultValue: "LV_OPA_COVER",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const img_recolor_property_info: LVGLPropertyInfo = {
    name: "img_recolor",
    displayName: "图像重新着色",
    type: PropertyType.ThemedColor,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_IMG_RECOLOR,
        description: "设置与图像混合的颜色。",
        defaultValue: "0x000000",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const img_recolor_opa_property_info: LVGLPropertyInfo = {
    name: "img_recolor_opa",
    displayName: "图像重新着色不透明度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_IMG_RECOLOR_OPA,
        description:
            "设置颜色混合的强度。值 0、LV_OPA_0 或 LV_OPA_TRANSP 表示完全透明，255、LV_OPA_100 或 LV_OPA_COVER 表示完全不透明，其他值或 LV_OPA_10、LV_OPA_20 等表示半透明。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};

//
// LINE
//

const line_width_property_info: LVGLPropertyInfo = {
    name: "line_width",
    displayName: "线条宽度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_LINE_WIDTH,
        description: "以像素设置线条宽度。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: true
    }
};
const line_dash_width_property_info: LVGLPropertyInfo = {
    name: "line_dash_width",
    displayName: "线条虚线宽度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_LINE_DASH_WIDTH,
        description:
            "以像素设置虚线的宽度。注意虚线仅适用于水平和垂直线",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const line_dash_gap_property_info: LVGLPropertyInfo = {
    name: "line_dash_gap",
    displayName: "线条虚线间隔",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_LINE_DASH_GAP,
        description:
            "设置虚线之间的像素间隔。注意虚线仅适用于水平和垂直线",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const line_rounded_property_info: LVGLPropertyInfo = {
    name: "line_rounded",
    displayName: "线条圆角",
    type: PropertyType.Boolean,
    checkboxStyleSwitch: true,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_LINE_ROUNDED,
        description:
            "使线条端点呈圆角。true：圆角，false：垂直线端点",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const line_color_property_info: LVGLPropertyInfo = {
    name: "line_color",
    displayName: "线条颜色",
    type: PropertyType.ThemedColor,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_LINE_COLOR,
        description: "设置线条颜色。",
        defaultValue: "0x000000",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const line_opa_property_info: LVGLPropertyInfo = {
    name: "line_opa",
    displayName: "线条不透明度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_LINE_OPA,
        description: "设置线条不透明度。",
        defaultValue: "LV_OPA_COVER",
        inherited: false,
        layout: false,
        extDraw: false
    }
};

//
// ARC
//

const arc_width_property_info: LVGLPropertyInfo = {
    name: "arc_width",
    displayName: "圆弧宽度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_ARC_WIDTH,
        description: "以像素设置圆弧的宽度（厚度）。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: true
    }
};
const arc_rounded_property_info: LVGLPropertyInfo = {
    name: "arc_rounded",
    displayName: "圆弧圆角",
    type: PropertyType.Boolean,
    checkboxStyleSwitch: true,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_ARC_ROUNDED,
        description:
            "使圆弧端点呈圆角。true：圆角，false：垂直线端点",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const arc_color_property_info: LVGLPropertyInfo = {
    name: "arc_color",
    displayName: "圆弧颜色",
    type: PropertyType.ThemedColor,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_ARC_COLOR,
        description: "设置圆弧颜色。",
        defaultValue: "0x000000",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const arc_opa_property_info: LVGLPropertyInfo = {
    name: "arc_opa",
    displayName: "圆弧不透明度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_ARC_OPA,
        description: "设置圆弧不透明度。",
        defaultValue: "LV_OPA_COVER",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const arc_img_src_property_info: LVGLPropertyInfo = {
    name: "arc_img_src",
    displayName: "圆弧图像源",
    type: PropertyType.ObjectReference,
    referencedObjectCollectionPath: "bitmaps",
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_ARC_IMG_SRC,
        description:
            "设置用于遮罩圆弧的图像。可用于在圆弧上显示复杂效果。可以是指向 lv_img_dsc_t 的指针或文件路径",
        defaultValue: "NULL",
        inherited: false,
        layout: false,
        extDraw: false
    }
};

//
// TEXT
//

const text_color_property_info: LVGLPropertyInfo = {
    name: "text_color",
    displayName: "文本颜色",
    type: PropertyType.ThemedColor,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TEXT_COLOR,
        description: "设置文本颜色。",
        defaultValue: "0x000000",
        inherited: true,
        layout: false,
        extDraw: false
    }
};
const text_opa_property_info: LVGLPropertyInfo = {
    name: "text_opa",
    displayName: "文本不透明度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TEXT_OPA,
        description:
            "设置文本的不透明度。值 0、LV_OPA_0 或 LV_OPA_TRANSP 表示完全透明，255、LV_OPA_100 或 LV_OPA_COVER 表示完全不透明，其他值或 LV_OPA_10、LV_OPA_20 等表示半透明。",
        defaultValue: "LV_OPA_COVER",
        inherited: true,
        layout: false,
        extDraw: false
    }
};
export const text_font_property_info: LVGLPropertyInfo = {
    name: "text_font",
    displayName: "文本字体",
    type: PropertyType.Enum,
    referencedObjectCollectionPath: "fonts",
    enumItems: (propertyValueHolder: PropertyValueHolder) => {
        let project = propertyValueHolder.projectStore?.project;
        if (!project) {
            project = ProjectEditor.getProject(propertyValueHolder);
        }
        return [
            ...project.fonts.map(font => ({
                id: font.name,
                label: font.name
            })),
            ...BUILT_IN_FONTS.map(id => ({ id, label: id }))
        ];
    },
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TEXT_FONT,
        description: "设置文本的字体（lv_font_t * 指针）。",
        defaultValue: "LV_FONT_DEFAULT",
        inherited: true,
        layout: true,
        extDraw: false
    }
};
const text_letter_space_property_info: LVGLPropertyInfo = {
    name: "text_letter_space",
    displayName: "文本字间距",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TEXT_LETTER_SPACE,
        description: "以像素设置字间距",
        defaultValue: "0",
        inherited: true,
        layout: true,
        extDraw: false
    }
};
const text_line_space_property_info: LVGLPropertyInfo = {
    name: "text_line_space",
    displayName: "文本行间距",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TEXT_LINE_SPACE,
        description: "以像素设置行间距。",
        defaultValue: "0",
        inherited: true,
        layout: true,
        extDraw: false
    }
};

const TextDecorationSide = observer(
    class TextDecorationSide extends React.Component<PropertyProps> {
        changeValue(newValue: any) {
            this.props.updateObject({
                [this.props.propertyInfo.name]: newValue
            });
        }

        render() {
            const { objects, propertyInfo, readOnly } = this.props;

            let enumItems: EnumItem[];

            if (propertyInfo.enumItems) {
                enumItems = getEnumItems(this.props.objects, propertyInfo);
            } else {
                enumItems = [];
            }

            const options = enumItems.map(enumItem => ({
                value: enumItem.id.toString(),
                label: (enumItem.label || enumItem.id).toString()
            }));

            let propertyValue = (objects[0] as any)[propertyInfo.name];
            for (let i = 1; i < objects.length; i++) {
                if ((objects[i] as any)[propertyInfo.name] != propertyValue) {
                    propertyValue = undefined;
                }
            }

            let selectedValues: any;
            let isMulti = false;

            if (propertyValue != undefined) {
                if (propertyValue == "NONE") {
                    selectedValues = [options[0]];
                } else {
                    selectedValues = [];

                    propertyValue
                        .toString()
                        .split("|")
                        .forEach((part: string) => {
                            if (part == "UNDERLINE") {
                                selectedValues.push(options[1]);
                            } else if (part == "STRIKETHROUGH") {
                                selectedValues.push(options[2]);
                            }
                        });

                    isMulti = true;
                }
            } else {
                selectedValues = [];
            }

            settingsController.isDarkTheme;

            return (
                <Select
                    options={options}
                    isMulti={isMulti}
                    onChange={selectedValues => {
                        if (!Array.isArray(selectedValues)) {
                            selectedValues = [selectedValues];
                        }

                        let propertyValue = "";

                        if (selectedValues.length == 0) {
                            propertyValue = "NONE";
                        } else if (
                            selectedValues[selectedValues.length - 1].value ==
                            "NONE"
                        ) {
                            propertyValue = "NONE";
                        } else {
                            for (let i = 0; i < selectedValues.length; i++) {
                                if (
                                    selectedValues[i].value == "UNDERLINE" ||
                                    selectedValues[i].value == "STRIKETHROUGH"
                                ) {
                                    propertyValue =
                                        (propertyValue
                                            ? propertyValue + "|"
                                            : "") + selectedValues[i].value;
                                }
                            }
                        }

                        if (!propertyValue) {
                            propertyValue = "NONE";
                        }

                        this.changeValue(propertyValue);
                    }}
                    isDisabled={readOnly}
                    isClearable={false}
                    value={selectedValues}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    theme={theme => {
                        return {
                            ...theme,
                            colors: {
                                ...theme.colors,

                                danger: "#DE350B",
                                dangerLight: "#FFBDAD",

                                ...(settingsController.isDarkTheme
                                    ? {
                                          neutral0: "hsl(0, 0%, 10%)",
                                          neutral5: "hsl(0, 0%, 20%)",
                                          neutral10: "hsl(0, 0%, 30%)",
                                          neutral20: "hsl(0, 0%, 40%)",
                                          neutral30: "hsl(0, 0%, 50%)",
                                          neutral40: "hsl(0, 0%, 60%)",
                                          neutral50: "hsl(0, 0%, 70%)",
                                          neutral60: "hsl(0, 0%, 80%)",
                                          neutral70: "hsl(0, 0%, 90%)",
                                          neutral80: "hsl(0, 0%, 95%)",
                                          neutral90: "hsl(0, 0%, 100%)"
                                      }
                                    : {
                                          neutral0: "hsl(0, 0%, 100%)",
                                          neutral5: "hsl(0, 0%, 95%)",
                                          neutral10: "hsl(0, 0%, 90%)",
                                          neutral20: "hsl(0, 0%, 80%)",
                                          neutral30: "hsl(0, 0%, 70%)",
                                          neutral40: "hsl(0, 0%, 60%)",
                                          neutral50: "hsl(0, 0%, 50%)",
                                          neutral60: "hsl(0, 0%, 40%)",
                                          neutral70: "hsl(0, 0%, 30%)",
                                          neutral80: "hsl(0, 0%, 20%)",
                                          neutral90: "hsl(0, 0%, 10%)"
                                      }),

                                primary: "#2684FF",
                                primary25: "#DEEBFF",
                                primary50: "#B2D4FF",
                                primary75: "#4C9AFF"
                            }
                        };
                    }}
                    styles={{
                        option: (baseStyles, state) => ({
                            ...baseStyles,
                            ...(settingsController.isDarkTheme &&
                            state.isFocused
                                ? { color: "#333" }
                                : {})
                        })
                    }}
                />
            );
        }
    }
);

const text_decor_property_info = makeEnumPropertyInfo(
    "text_decor",
    "Text Decoration",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TEXT_DECOR,
        description:
            "设置文本装饰。可选值为 LV_TEXT_DECOR_NONE/UNDERLINE/STRIKETHROUGH。也可使用按位或组合的值。",
        defaultValue: "LV_TEXT_DECOR_NONE",
        inherited: true,
        layout: false,
        extDraw: false,

        valueRead: (value: number) => {
            if (value == 0x00) {
                return "NONE";
            }

            let propertyValue = "";

            if (value & 0x01) {
                propertyValue =
                    (propertyValue ? propertyValue + "|" : "") + "UNDERLINE";
            }

            if (value & 0x02) {
                propertyValue =
                    (propertyValue ? propertyValue + "|" : "") +
                    "STRIKETHROUGH";
            }

            return propertyValue;
        },
        valueToNum: (value: string) => {
            if (value == "NONE") {
                return 0;
            }

            let num = 0;

            if (value.indexOf("UNDERLINE") != -1) {
                num |= 0x01;
            }

            if (value.indexOf("STRIKETHROUGH") != -1) {
                num |= 0x02;
            }

            return num;
        },
        valueBuild: (value: string) => {
            if (value == "NONE") {
                return "LV_TEXT_DECOR_NONE";
            }

            let build = "";

            if (value.indexOf("UNDERLINE") != -1) {
                build = (build ? build + "|" : "") + "LV_TEXT_DECOR_UNDERLINE";
            }

            if (value.indexOf("STRIKETHROUGH") != -1) {
                build =
                    (build ? build + "|" : "") + "LV_TEXT_DECOR_STRIKETHROUGH";
            }

            return build;
        }
    },
    ["NONE", "UNDERLINE", "STRIKETHROUGH"],
    "LV_TEXT_DECOR_",
    TextDecorationSide
);

const text_align_property_info = makeEnumPropertyInfo(
    "text_align",
    "Text Align",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TEXT_ALIGN,
        description:
            "设置文本行的对齐方式。注意它不对齐对象本身，只对齐对象内的行。可选值为 LV_TEXT_ALIGN_LEFT/CENTER/RIGHT/AUTO。LV_TEXT_ALIGN_AUTO 会检测文本基本方向并相应使用左对齐或右对齐",
        defaultValue: "LV_TEXT_ALIGN_AUTO",
        inherited: true,
        layout: true,
        extDraw: false
    },
    ["AUTO", "LEFT", "CENTER", "RIGHT"],
    "LV_TEXT_ALIGN_"
);

//
// MISCELLANEOUS
//

export const radius_property_info: LVGLPropertyInfo = {
    name: "radius",
    displayName: "圆角半径",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_RADIUS,
        description:
            "设置每个角的圆角半径。值以像素（>= 0）解释，或使用 LV_RADIUS_CIRCLE 表示最大半径",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};

const radial_offset_property_info: LVGLPropertyInfo = {
    name: "radial_offset",
    displayName: "径向偏移",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_RADIAL_OFFSET,
        description:
            "沿径向移动对象的起始点（如刻度）",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};

const clip_corner_property_info: LVGLPropertyInfo = {
    name: "clip_corner",
    displayName: "裁剪圆角",
    type: PropertyType.Boolean,
    checkboxStyleSwitch: true,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_CLIP_CORNER,
        description:
            "启用后在圆角处裁剪溢出内容。可为 true 或 false。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
export const opa_property_info: LVGLPropertyInfo = {
    name: "opa",
    displayName: "不透明度",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_OPA,
        description:
            "按此系数缩放对象的所有不透明度值。值 0、LV_OPA_0 或 LV_OPA_TRANSP 表示完全透明，255、LV_OPA_100 或 LV_OPA_COVER 表示完全不透明，其他值或 LV_OPA_10、LV_OPA_20 等表示半透明。",
        defaultValue: "LV_OPA_COVER",
        inherited: true,
        layout: false,
        extDraw: false
    }
};
const color_filter_dsc_property_info: LVGLPropertyInfo = {
    name: "color_filter_dsc",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_COLOR_FILTER_DSC,
        description: "将一种颜色混合到对象的所有颜色。",
        defaultValue: "NULL",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const color_filter_opa_property_info: LVGLPropertyInfo = {
    name: "color_filter_opa",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_COLOR_FILTER_OPA,
        description: "颜色滤镜的混合强度。",
        defaultValue: "LV_OPA_TRANSP",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const anim_property_info: LVGLPropertyInfo = {
    name: "anim",
    type: PropertyType.String,
    formText: "e.g., delay=1000, repeat_delay=1000, repeat_count=3 (any order, all optional, repeat_count=-1 for infinite)",
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_ANIM,
        description:
            "对象动画的动画模板。应为指向 lv_anim_t 的指针。动画参数因控件而异，例如动画时间可以是文本区域光标的闪烁时间或滚轮的滚动时间。更多信息请参见控件文档。",
        defaultValue: "NULL",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const anim_time_property_info: LVGLPropertyInfo = {
    name: "anim_time",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_ANIM_TIME,
        description:
            "动画时间（毫秒）。其含义因控件而异。例如文本区域光标的闪烁时间或滚轮的滚动时间。更多信息请参见控件文档。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const anim_duration_property_info: LVGLPropertyInfo = {
    name: "anim_duration",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_ANIM_DURATION,
        description: "",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const anim_speed_property_info: LVGLPropertyInfo = {
    name: "anim_speed",
    type: PropertyType.Number,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_ANIM_SPEED,
        description:
            "动画速度（像素/秒）。其含义因控件而异。例如标签的滚动速度。更多信息请参见控件文档。",
        defaultValue: "0",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const transition_property_info: LVGLPropertyInfo = {
    name: "transition",
    type: PropertyType.Any,
    lvglStyleProp: {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_TRANSITION,
        description:
            "用于描述过渡的已初始化 lv_style_transition_dsc_t。",
        defaultValue: "NULL",
        inherited: false,
        layout: false,
        extDraw: false
    }
};
const blend_mode_property_info = makeEnumPropertyInfo(
    "blend_mode",
    "Blend mode",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BLEND_MODE,
        description:
            "描述颜色如何与背景混合。可选值为 LV_BLEND_MODE_NORMAL/ADDITIVE/SUBTRACTIVE/MULTIPLY",
        defaultValue: "LV_BLEND_MODE_NORMAL",
        inherited: false,
        layout: false,
        extDraw: false
    },
    [
        "NORMAL", // Simply mix according to the opacity value
        "ADDITIVE", // Add the respective color channels
        "SUBTRACTIVE", // Subtract the foreground from the background
        "MULTIPLY", // Multiply the foreground and background
        "REPLACE" // Replace background with foreground in the area
    ],
    "LV_BLEND_MODE_"
);
const base_dir_property_info = makeEnumPropertyInfo(
    "base_dir",
    "Base direction",
    {
        code: LVGL_STYLE_PROP_CODES.LV_STYLE_BASE_DIR,
        description:
            "设置对象的基本方向。可选值为 LV_BIDI_DIR_LTR/RTL/AUTO。",
        defaultValue: "LV_BASE_DIR_AUTO",
        inherited: true,
        layout: true,
        extDraw: false
    },
    ["LTR", "RTL", "AUTO"],
    "LV_BASE_DIR_"
);

////////////////////////////////////////////////////////////////////////////////

export interface LVGLPropertiesGroup {
    groupName: string;
    groupDescription: string;
    properties: LVGLPropertyInfo[];
}

export const lvglProperties: LVGLPropertiesGroup[] = [
    {
        groupName: "POSITION AND SIZE",
        groupDescription:
            "Properties related to size, position, alignment and layout of the objects.",
        properties: [
            align_property_info,
            width_property_info,
            height_property_info,

            length_property_info,

            min_width_property_info,
            max_width_property_info,
            min_height_property_info,
            max_height_property_info,

            x_property_info,
            y_property_info,

            transform_width_property_info,
            transform_height_property_info,
            translate_x_property_info,
            translate_y_property_info,

            transform_zoom_property_info,
            transform_scale_x_property_info,
            transform_scale_y_property_info,

            transform_angle_property_info,
            transform_rotation_property_info,

            transform_pivot_x_property_info,
            transform_pivot_y_property_info,

            transform_skew_x_property_info,
            transform_skew_y_property_info
        ]
    },

    {
        groupName: "LAYOUT",
        groupDescription: "Properties to describe layout.",
        properties: [
            layout_property_info,

            flex_flow_property_info,
            flex_main_place_property_info,
            flex_cross_place_property_info,
            flex_track_place_property_info,
            flex_grow_property_info,

            grid_column_align_property_info,
            grid_row_align_property_info,
            grid_row_dsc_array_property_info,
            grid_column_dsc_array_property_info,
            grid_cell_column_pos_property_info,
            grid_cell_column_span_property_info,
            grid_cell_x_align_property_info,
            grid_cell_row_pos_property_info,
            grid_cell_row_span_property_info,
            grid_cell_y_align_property_info
        ]
    },

    {
        groupName: "PADDING",
        groupDescription:
            "Properties to describe spacing between the parent's sides and the children and among the children. Very similar to the padding properties in HTML.",
        properties: [
            pad_top_property_info,
            pad_bottom_property_info,
            pad_left_property_info,
            pad_right_property_info,
            pad_radial_property_info,
            pad_row_property_info,
            pad_column_property_info
        ]
    },

    {
        groupName: "MARGIN",
        groupDescription:
            "Properties to describe spacing around an object. Very similar to the margin properties in HTML.",
        properties: [
            margin_top_property_info,
            margin_bottom_property_info,
            margin_left_property_info,
            margin_right_property_info
        ]
    },

    {
        groupName: "BACKGROUND",
        groupDescription:
            "Properties to describe the background color and image of the objects.",
        properties: [
            bg_color_property_info,
            bg_opa_property_info,

            bg_grad_dir_property_info,
            bg_grad_color_property_info,
            bg_grad_stop_property_info,
            bg_main_stop_property_info,

            bg_main_opa_property_info,
            bg_grad_opa_property_info,
            //bg_grad_property_info,
            bg_dither_mode_property_info,

            bg_img_src_property_info,
            bg_img_opa_property_info,
            bg_img_recolor_property_info,
            bg_img_recolor_opa_property_info,

            bg_img_tiled_property_info
        ]
    },

    {
        groupName: "BORDER",
        groupDescription: "Properties to describe the borders",
        properties: [
            border_color_property_info,
            border_opa_property_info,
            border_width_property_info,
            border_side_property_info,
            border_post_property_info
        ]
    },

    {
        groupName: "OUTLINE",
        groupDescription:
            "Properties to describe the outline. It's like a border but drawn outside of the rectangles.",
        properties: [
            outline_width_property_info,
            outline_color_property_info,
            outline_opa_property_info,
            outline_pad_property_info
        ]
    },

    {
        groupName: "SHADOW",
        groupDescription:
            "Properties to describe the shadow drawn under the rectangles.",
        properties: [
            shadow_width_property_info,
            shadow_ofs_x_property_info,
            shadow_ofs_y_property_info,
            shadow_spread_property_info,
            shadow_color_property_info,
            shadow_opa_property_info
        ]
    },

    {
        groupName: "IMAGE",
        groupDescription: "Properties to describe the images",
        properties: [
            img_opa_property_info,
            img_recolor_property_info,
            img_recolor_opa_property_info
        ]
    },

    {
        groupName: "LINE",
        groupDescription: "Properties to describe line-like objects",
        properties: [
            line_width_property_info,
            line_dash_width_property_info,
            line_dash_gap_property_info,
            line_rounded_property_info,
            line_color_property_info,
            line_opa_property_info
        ]
    },

    {
        groupName: "ARC",
        groupDescription: "TODO",
        properties: [
            arc_width_property_info,
            arc_rounded_property_info,
            arc_color_property_info,
            arc_opa_property_info,
            arc_img_src_property_info
        ]
    },

    {
        groupName: "TEXT",
        groupDescription:
            "Properties to describe the properties of text. All these properties are inherited.",
        properties: [
            text_color_property_info,
            text_opa_property_info,
            text_font_property_info,
            text_letter_space_property_info,
            text_line_space_property_info,
            text_decor_property_info,
            text_align_property_info
        ]
    },

    {
        groupName: "MISCELLANEOUS",
        groupDescription: "Mixed properties for various purposes.",
        properties: [
            radius_property_info,
            radial_offset_property_info,
            clip_corner_property_info,
            opa_property_info,
            //color_filter_dsc_property_info,
            //color_filter_opa_property_info,
            //transition_property_info,
            blend_mode_property_info,
            base_dir_property_info,

            anim_property_info,
            anim_time_property_info,
            anim_duration_property_info,
            anim_speed_property_info
        ]
    }
];

export const unusedProperties = [
    width_property_info,
    height_property_info,
    x_property_info,
    y_property_info,

    bg_grad_property_info,

    color_filter_dsc_property_info,
    color_filter_opa_property_info,
    anim_property_info,
    transition_property_info
];

export const lvglPropertiesMap = new Map<string, LVGLPropertyInfo>();
lvglProperties.forEach(propertyGroup =>
    propertyGroup.properties.forEach(property => {
        if (lvglPropertiesMap.get(property.name)) {
            console.error("UNEXPECTED!", property.name);
        }
        lvglPropertiesMap.set(property.name, property);
    })
);

export function isLvglStylePropertySupported(
    object: IEezObject,
    propertyInfo: LVGLPropertyInfo
) {
    const lvglVersion =
        ProjectEditor.getProject(object).settings.general.lvglVersion;

    return propertyInfo.lvglStyleProp.code[lvglVersion] != undefined;
}

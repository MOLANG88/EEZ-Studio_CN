import React from "react";
import { IActionPropertyDefinition, registerAction } from "./actions";
import {
    LV_BUTTONMATRIX_CTRL_ENUM_NAME,
    LV_OBJ_FLAG_ENUM_NAME,
    LV_PART_ENUM_NAME,
    LV_SCR_LOAD_ANIM_ENUM_NAME,
    LV_STATE_ENUM_NAME
} from "./lvgl-constants";
import { registerLvglEnum } from "./widgets";
import { RightArrow } from "project-editor/ui-components/icons";
import type { Project } from "project-editor/project/project";

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 0,
    name: "changeScreen",
    group: "Screen",
    properties: [
        {
            name: "screen",
            type: "screen",
            helpText: "要切换到的屏幕"
        },
        {
            name: "fadeMode",
            type: `enum:${LV_SCR_LOAD_ANIM_ENUM_NAME}`,
            helpText:
                "从前一页面切换到新页面时的动画选择"
        },
        {
            name: "speed",
            type: "integer",
            helpText: "动画持续时间（毫秒）"
        },
        {
            name: "delay",
            type: "integer",
            helpText: "动画开始前的延迟（毫秒）。"
        },
        {
            name: "useStack",
            type: "boolean",
            helpText: "将活动屏幕压入栈。"
        }
    ],
    defaults: {
        fadeMode: "FADE_IN",
        speed: 200,
        delay: 0,
        useStack: true
    },
    label: (
        [screen, fadeMode, speed, delay, useStack],
        [_1, _2, speedLabel, delayLabel, useStackLabel]
    ) => (
        <>
            {screen} {fadeMode} <i>{speedLabel}</i>={speed} <i>{delayLabel}</i>=
            {delay}
            {useStack !== "ON" && (
                <>
                    <i> {useStackLabel}</i>={useStack}
                </>
            )}
        </>
    ),
    helpText: "切换到指定屏幕"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 1,
    name: "changeToPreviousScreen",
    group: "Screen",
    properties: [
        {
            name: "fadeMode",
            type: `enum:${LV_SCR_LOAD_ANIM_ENUM_NAME}`,
            helpText:
                "从前一页面切换到新页面时的动画选择"
        },
        {
            name: "speed",
            type: "integer",
            helpText: "动画持续时间（毫秒）"
        },
        {
            name: "delay",
            type: "integer",
            helpText: "动画开始前的延迟（毫秒）。"
        }
    ],
    defaults: {
        fadeMode: "FADE_IN",
        speed: 200,
        delay: 0
    },
    label: ([fadeMode, speed, delay], [_, speedLabel, delayLabel]) => (
        <>
            {fadeMode} <i>{speedLabel}</i>={speed} <i>{delayLabel}</i>={delay}
        </>
    ),
    helpText: "切换到上一个屏幕"
});

const SCREENS_LIFETIME_SUPPORT_DISABLED_MESSAGE =
    " action is not available if 'Screens lifetime support' is not enabled in Settings - Build";

registerAction({
    id: 47,
    name: "createScreen",
    group: "Screen",
    properties: [
        {
            name: "screen",
            type: "screen",
            helpText: "要创建的屏幕"
        }
    ],
    defaults: {},
    label: ([screen]) => <>{screen}</>,
    helpText: `创建屏幕（应在“设置 - 构建”中启用“屏幕生命周期支持”）`,
    disabled: (project: Project) =>
        project.settings.build.screensLifetimeSupport
            ? false
            : "'Create Screen' " + SCREENS_LIFETIME_SUPPORT_DISABLED_MESSAGE
});

registerAction({
    id: 48,
    name: "deleteScreen",
    group: "Screen",
    properties: [
        {
            name: "screen",
            type: "screen",
            helpText: "要删除的屏幕"
        }
    ],
    defaults: {},
    label: ([screen]) => <>{screen}</>,
    helpText: `删除屏幕（应在“设置 - 构建”中启用“屏幕生命周期支持”）`,
    disabled: (project: Project) =>
        project.settings.build.screensLifetimeSupport
            ? false
            : "'Delete Screen' " + SCREENS_LIFETIME_SUPPORT_DISABLED_MESSAGE
});

registerAction({
    id: 49,
    name: "isScreenCreated",
    group: "Screen",
    properties: [
        {
            name: "screen",
            type: "screen",
            helpText: "屏幕"
        },
        {
            name: "result",
            type: "boolean",
            isAssignable: true,
            helpText: "用于存储屏幕状态的布尔变量"
        }
    ],
    defaults: {},
    label: ([screen, result]) => (
        <>
            <>
                {screen}
                <RightArrow />
                {result}
            </>
        </>
    ),
    helpText: `检查屏幕是否已创建（应在“设置 - 构建”中启用“屏幕生命周期支持”）`,
    disabled: (project: Project) =>
        project.settings.build.screensLifetimeSupport
            ? false
            : "'Is Screen Created' action " +
              SCREENS_LIFETIME_SUPPORT_DISABLED_MESSAGE
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 2,
    name: "objSetX",
    group: "Widget - Position and Size",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要设置 X 坐标的对象"
        },
        {
            name: "x",
            type: "integer",
            helpText: "要设置的 X 坐标"
        }
    ],
    defaults: {},
    label: ([object, x]) => (
        <>
            {object} {x}
        </>
    ),
    helpText: "设置对象 X 坐标"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 3,
    name: "objGetX",
    group: "Widget - Position and Size",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "获取 X 坐标的对象"
        },
        {
            name: "result",
            type: "integer",
            isAssignable: true,
            helpText: "用于存储 X 坐标的变量"
        }
    ],
    defaults: {},
    label: ([object, width]) => (
        <>
            {object}
            <RightArrow />
            {width}
        </>
    ),
    helpText: "获取对象 X 坐标"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 4,
    name: "objSetY",
    group: "Widget - Position and Size",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要设置 Y 坐标的对象"
        },
        {
            name: "y",
            type: "integer",
            helpText: "要设置的 Y 坐标"
        }
    ],
    defaults: {},
    label: ([object, y]) => (
        <>
            {object} {y}
        </>
    ),
    helpText: "设置对象 Y 坐标"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 5,
    name: "objGetY",
    group: "Widget - Position and Size",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "获取 Y 坐标的对象"
        },
        {
            name: "result",
            type: "integer",
            isAssignable: true,
            helpText: "用于存储 Y 坐标的变量"
        }
    ],
    defaults: {},
    label: ([object, width]) => (
        <>
            {object}
            <RightArrow />
            {width}
        </>
    ),
    helpText: "获取对象 Y 坐标"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 63,
    name: "objGetDisplayX",
    group: "Widget - Position and Size",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "获取 X 坐标的对象"
        },
        {
            name: "result",
            type: "integer",
            isAssignable: true,
            helpText: "用于存储 X 坐标的变量"
        }
    ],
    defaults: {},
    label: ([object, width]) => (
        <>
            {object}
            <RightArrow />
            {width}
        </>
    ),
    helpText: "获取对象相对于显示原点的 X 坐标"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 64,
    name: "objGetDisplayY",
    group: "Widget - Position and Size",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "获取 Y 坐标的对象"
        },
        {
            name: "result",
            type: "integer",
            isAssignable: true,
            helpText: "用于存储 Y 坐标的变量"
        }
    ],
    defaults: {},
    label: ([object, width]) => (
        <>
            {object}
            <RightArrow />
            {width}
        </>
    ),
    helpText: "获取对象相对于显示原点的 Y 坐标"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 6,
    name: "objSetWidth",
    group: "Widget - Position and Size",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要设置宽度的对象"
        },
        {
            name: "width",
            type: "integer",
            helpText: "要设置的宽度"
        }
    ],
    defaults: {},
    label: ([object, width]) => (
        <>
            {object} {width}
        </>
    ),
    helpText: "设置对象宽度"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 7,
    name: "objGetWidth",
    group: "Widget - Position and Size",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要获取宽度的对象"
        },
        {
            name: "result",
            type: "integer",
            isAssignable: true,
            helpText: "用于存储宽度的变量"
        }
    ],
    defaults: {},
    label: ([object, width]) => (
        <>
            {object}
            <RightArrow />
            {width}
        </>
    ),
    helpText: "获取对象宽度"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 8,
    name: "objSetHeight",
    group: "Widget - Position and Size",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要设置高度的对象"
        },
        {
            name: "height",
            type: "integer",
            helpText: "要设置的高度"
        }
    ],
    defaults: {},
    label: ([object, height]) => (
        <>
            {object} {height}
        </>
    ),
    helpText: "设置对象高度"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 9,
    name: "objGetHeight",
    group: "Widget - Position and Size",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要获取高度的对象"
        },
        {
            name: "result",
            type: "integer",
            isAssignable: true,
            helpText: "用于存储高度的变量"
        }
    ],
    defaults: {},
    label: ([object, width]) => (
        <>
            {object}
            <RightArrow />
            {width}
        </>
    ),
    helpText: "获取对象高度"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 59,
    name: "objStyleSetProperty",
    displayName: "设置对象样式属性",
    group: "Widget - Styles",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "控件"
        },
        {
            name: "property",
            type: "style-property",
            helpText: "要设置的样式属性"
        },
        {
            name: "value",
            type: "style-value",
            helpText: "要为属性设置的值"
        },
        {
            name: "part",
            type: `enum:${LV_PART_ENUM_NAME}`,
            helpText: "要设置属性的对象部分"
        },
        {
            name: "state",
            type: `enum:${LV_STATE_ENUM_NAME}`,
            helpText: "要设置属性的对象状态"
        }
    ],
    defaults: {
        part: "MAIN",
        state: "DEFAULT"
    },
    label: ([object, property, value, part, state]) => (
        <>
            {object} "{property}" {value ?? "?"}{part != "MAIN" ? ` ${part}` : ""}{state != "DEFAULT" ? ` ${state}` : ""}
        </>
    ),
    helpText: "设置样式中属性的值。"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 10,
    name: "objSetStyleOpa",
    group: "Widget - Styles",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要设置不透明度的对象"
        },
        {
            name: "opacity",
            type: "integer",
            helpText: "要设置的不透明度（0-255）"
        }
    ],
    defaults: {},
    label: ([object, opacity]) => (
        <>
            {object} {opacity}
        </>
    ),
    helpText: "设置对象不透明度"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 11,
    name: "objGetStyleOpa",
    group: "Widget - Styles",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要获取不透明度的对象"
        },
        {
            name: "result",
            type: "integer",
            isAssignable: true,
            helpText: "用于存储不透明度的变量"
        }
    ],
    defaults: {},
    label: ([object, width]) => (
        <>
            {object}
            <RightArrow />
            {width}
        </>
    ),
    helpText: "获取对象不透明度"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 12,
    name: "objAddStyle",
    group: "Widget - Styles",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要添加样式的对象"
        },
        {
            name: "style",
            type: "style",
            helpText: "要添加的样式"
        }
    ],
    defaults: {},
    label: ([object, style]) => (
        <>
            {object} {style}
        </>
    ),
    helpText: "向对象添加样式"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 13,
    name: "objRemoveStyle",
    group: "Widget - Styles",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要移除样式的对象"
        },
        {
            name: "style",
            type: "style",
            helpText: "要移除的样式"
        }
    ],
    defaults: {},
    label: ([object, style]) => (
        <>
            {object} {style}
        </>
    ),
    helpText: "从对象移除样式"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 14,
    name: "objSetFlagHidden",
    group: "Widget - Flags",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要设置隐藏标志的对象"
        },
        {
            name: "hidden",
            type: "boolean",
            helpText: "隐藏标志值"
        }
    ],
    defaults: {
        hidden: true
    },
    label: ([object, hidden]) => (
        <>
            {object} {hidden}
        </>
    ),
    helpText: "设置对象的隐藏标志"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 15,
    name: "objAddFlag",
    group: "Widget - Flags",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要添加标志的对象"
        },
        {
            name: "flag",
            type: `enum:${LV_OBJ_FLAG_ENUM_NAME}`,
            helpText: "要添加的标志"
        }
    ],
    defaults: {
        flag: "HIDDEN"
    },
    label: ([object, flag]) => (
        <>
            {object} {flag}
        </>
    ),
    helpText: "向对象添加标志"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 16,
    name: "objClearFlag",
    group: "Widget - Flags",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要清除标志的对象"
        },
        {
            name: "flag",
            type: `enum:${LV_OBJ_FLAG_ENUM_NAME}`,
            helpText: "要清除的标志"
        }
    ],
    defaults: {
        flag: "HIDDEN"
    },
    label: ([object, flag]) => (
        <>
            {object} {flag}
        </>
    ),
    helpText: "从对象清除标志"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 17,
    name: "objHasFlag",
    group: "Widget - Flags",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要检查标志的对象"
        },
        {
            name: "flag",
            type: `enum:${LV_OBJ_FLAG_ENUM_NAME}`,
            helpText: "要检查的标志"
        },
        {
            name: "result",
            type: `boolean`,
            isAssignable: true,
            helpText: "用于存储结果的变量"
        }
    ],
    defaults: {
        flag: "HIDDEN"
    },
    label: ([object, flag, result]) => (
        <>
            {object} {flag}
            <RightArrow />
            {result}
        </>
    ),
    helpText: "检查对象是否具有指定标志"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 18,
    name: "objSetStateChecked",
    group: "Widget - Flags",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要设置勾选状态的对象"
        },
        {
            name: "checked",
            type: "boolean",
            helpText: "要设置的勾选状态"
        }
    ],
    defaults: {
        checked: true
    },
    label: ([object, checked]) => (
        <>
            {object} {checked}
        </>
    ),
    helpText: "设置对象的勾选状态"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 19,
    name: "objSetStateDisabled",
    group: "Widget - States",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要设置禁用状态的对象"
        },
        {
            name: "disabled",
            type: "boolean",
            helpText: "要设置的禁用状态"
        }
    ],
    defaults: {
        disabled: true
    },
    label: ([object, disabled]) => (
        <>
            {object} {disabled}
        </>
    ),
    helpText: "设置对象的禁用状态"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 20,
    name: "objAddState",
    group: "Widget - States",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要添加状态的对象"
        },
        {
            name: "state",
            type: `enum:${LV_STATE_ENUM_NAME}`,
            helpText: "要添加的状态"
        }
    ],
    defaults: {
        state: "CHECKED"
    },
    label: ([object, state]) => (
        <>
            {object} {state}
        </>
    ),
    helpText: "向对象添加状态"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 21,
    name: "objClearState",
    group: "Widget - States",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要清除状态的对象"
        },
        {
            name: "state",
            type: `enum:${LV_STATE_ENUM_NAME}`,
            helpText: "要清除的状态"
        }
    ],
    defaults: {
        state: "CHECKED"
    },
    label: ([object, state]) => (
        <>
            {object} {state}
        </>
    ),
    helpText: "从对象清除状态"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 22,
    name: "objHasState",
    group: "Widget - States",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要检查状态的对象"
        },
        {
            name: "state",
            type: `enum:${LV_STATE_ENUM_NAME}`,
            helpText: "要检查的状态"
        },
        {
            name: "result",
            type: `boolean`,
            isAssignable: true,
            helpText: "用于存储结果的变量"
        }
    ],
    defaults: {
        flag: "HIDDEN"
    },
    label: ([object, state, result]) => (
        <>
            {object} {state}
            <RightArrow />
            {result}
        </>
    ),
    helpText: "检查对象是否具有指定状态"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 23,
    name: "arcSetValue",
    group: "Arc",
    properties: [
        {
            name: "object",
            type: "widget:Arc",
            helpText: "用于设置值的圆弧"
        },
        {
            name: "value",
            type: "integer",
            helpText: "要设置的值"
        }
    ],
    defaults: {},
    label: ([object, value]) => (
        <>
            {object} {value}
        </>
    ),
    helpText: "设置圆弧值"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 62,
    name: "arcRotateObjToAngle",
    group: "Arc",
    properties: [
        {
            name: "object",
            type: "widget:Arc",
            helpText: "圆弧对象"
        },
        {
            name: "objToRotate",
            type: "widget",
            helpText: "要旋转的对象"
        },
        {
            name: "offset",
            type: "integer",
            helpText: "用此值增大圆角半径（< 0：减小半径）"
        }
    ],
    defaults: {},
    label: ([object, objToRotate, offset]) => (
        <>
            {object} {objToRotate} {offset}
        </>
    ),
    helpText: "将对象旋转到圆弧（旋钮）的当前位置"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 24,
    name: "barSetValue",
    group: "Bar",
    properties: [
        {
            name: "object",
            type: "widget:Bar",
            helpText: "用于设置值的进度条"
        },
        {
            name: "value",
            type: "integer",
            helpText: "要设置的值（0-100）"
        },
        {
            name: "animated",
            type: "boolean",
            helpText: "设置值时使用动画"
        }
    ],
    defaults: {
        animated: true
    },
    label: ([object, value, animated], [_1, _2, animatedLabel]) => (
        <>
            {object} {value} <i>{animatedLabel}</i>={animated}
        </>
    ),
    helpText: "设置进度条的值"
});

registerAction({
    id: 54,
    name: "buttonMatrixSetButtonCtrl",
    group: "ButtonMatrix",
    properties: [
        {
            name: "object",
            type: "widget:ButtonMatrix",
            helpText: "用于设置值的进度条"
        },
        {
            name: "buttonID",
            type: "integer",
            helpText:
                "要修改的按钮的从 0 开始索引（不计算换行符）"
        },
        {
            name: "ctrl",
            type: `enum:${LV_BUTTONMATRIX_CTRL_ENUM_NAME}`,
            helpText:
                "按位或组合的属性。例如 `LV_BUTTONMATRIX_CTRL.NO_REPEAT | LV_BUTTONMATRIX_CTRL.CHECKABLE`"
        }
    ],
    defaults: {},
    label: ([object, buttonID, ctrl], [_1, _2, _3]) => (
        <>
            {object} {buttonID} {ctrl}
        </>
    ),
    helpText: "设置进度条的值"
});

registerAction({
    id: 55,
    name: "buttonMatrixClearButtonCtrl",
    group: "ButtonMatrix",
    properties: [
        {
            name: "object",
            type: "widget:ButtonMatrix",
            helpText: "用于设置值的进度条"
        },
        {
            name: "buttonID",
            type: "integer",
            helpText:
                "要修改的按钮的从 0 开始索引（不计算换行符）"
        },
        {
            name: "ctrl",
            type: `enum:${LV_BUTTONMATRIX_CTRL_ENUM_NAME}`,
            helpText:
                "按位或组合的属性。例如 `LV_BUTTONMATRIX_CTRL.NO_REPEAT | LV_BUTTONMATRIX_CTRL.CHECKABLE`"
        }
    ],
    defaults: {},
    label: ([object, buttonID, ctrl], [_1, _2, _3]) => (
        <>
            {object} {buttonID} {ctrl}
        </>
    ),
    helpText: "清除按钮矩阵中某个按钮的属性"
});

registerAction({
    id: 50,
    name: "calendarSetTodayDate",
    group: "Calendar",
    properties: [
        {
            name: "object",
            type: "widget:Calendar",
            helpText: "日历对象"
        },
        {
            name: "year",
            type: "integer",
            helpText: "今天年份"
        },
        {
            name: "month",
            type: "integer",
            helpText: "今天月份 [1..12]"
        },
        {
            name: "day",
            type: "integer",
            helpText: "今天日期 [1..31]"
        }
    ],
    defaults: {},
    label: ([object, year, month, day]) => (
        <>
            <>
                {object} {year} {month} {day}
            </>
        </>
    ),
    helpText: "设置今天日期"
});

registerAction({
    id: 51,
    name: "calendarSetShowedDate",
    group: "Calendar",
    properties: [
        {
            name: "object",
            type: "widget:Calendar",
            helpText: "日历对象"
        },
        {
            name: "year",
            type: "integer",
            helpText: "显示年份"
        },
        {
            name: "month",
            type: "integer",
            helpText: "显示月份 [1..12]"
        }
    ],
    defaults: {},
    label: ([object, year, month]) => (
        <>
            <>
                {object} {year} {month}
            </>
        </>
    ),
    helpText: "设置当前显示的"
});

registerAction({
    id: 52,
    name: "calendarSetHighlightedDate",
    group: "Calendar",
    properties: [
        {
            name: "object",
            type: "widget:Calendar",
            helpText: "日历对象"
        },
        {
            name: "year",
            type: "integer",
            helpText: "高亮年份"
        },
        {
            name: "month",
            type: "integer",
            helpText: "高亮月份 [1..12]"
        },
        {
            name: "day",
            type: "integer",
            helpText: "高亮日期 [1..31]"
        }
    ],
    defaults: {},
    label: ([object, year, month]) => (
        <>
            <>
                {object} {year} {month}
            </>
        </>
    ),
    helpText: "设置高亮日期"
});

registerAction({
    id: 53,
    name: "calendarGetPressedDate",
    group: "Calendar",
    properties: [
        {
            name: "object",
            type: "widget:Calendar",
            helpText: "日历对象"
        },
        {
            name: "year",
            type: "integer",
            isAssignable: true,
            helpText: "用于存储年份的整数变量"
        },
        {
            name: "month",
            type: "integer",
            isAssignable: true,
            helpText: "用于存储月份（1..12）的整数变量"
        },
        {
            name: "day",
            type: "integer",
            isAssignable: true,
            helpText: "用于存储日期（1..31）的整数变量"
        }
    ],
    defaults: {},
    label: ([object, year, month, day]) => (
        <>
            <>
                {object}
                <RightArrow />
                {year} {month} {day}
            </>
        </>
    ),
    helpText: "获取当前按下的日期"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 25,
    name: "dropdownSetSelected",
    group: "Dropdown",
    properties: [
        {
            name: "object",
            type: "widget:Dropdown",
            helpText: "用于设置所选项的下拉框"
        },
        {
            name: "selected",
            type: "integer",
            helpText: "所选项目的索引"
        }
    ],
    defaults: {},
    label: ([object, selected]) => (
        <>
            {object} {selected}
        </>
    ),
    helpText: "设置下拉框的所选项"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 26,
    name: "imageSetSrc",
    group: "Image",
    properties: [
        {
            name: "object",
            type: "widget:Image",
            helpText: "用于设置源的图像"
        },
        {
            name: "src",
            type: "image",
            helpText: "以字符串形式给定的源图像"
        }
    ],
    defaults: {},
    label: ([object, src]) => (
        <>
            {object} {src}
        </>
    ),
    helpText: "设置图像的源图像"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 27,
    name: "imageSetAngle",
    group: "Image",
    properties: [
        {
            name: "object",
            type: "widget:Image",
            helpText: "用于设置角度的图像"
        },
        {
            name: "angle",
            type: "integer",
            helpText:
                "要设置的角度。角度具有 0.1 度精度，因此 45.8° 应设置为 458。"
        }
    ],
    defaults: {},
    label: ([object, angle]) => (
        <>
            {object} {angle}
        </>
    ),
    helpText: "设置图像角度"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 28,
    name: "imageSetZoom",
    group: "Image",
    properties: [
        {
            name: "object",
            type: "widget:Image",
            helpText: "用于设置缩放的图像"
        },
        {
            name: "zoom",
            type: "integer",
            helpText:
                "要设置的缩放。将系数设为 256 可禁用缩放。更大的值放大图像（如 512 为两倍大小），更小的值缩小图像（如 128 为一半大小）。"
        }
    ],
    defaults: {},
    label: ([object, zoom]) => (
        <>
            {object} {zoom}
        </>
    ),
    helpText: "设置图像缩放"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 32,
    name: "keyboardSetTextarea",
    group: "Keyboard",
    properties: [
        {
            name: "object",
            type: "widget:Keyboard",
            helpText: "用于设置文本区域的键盘"
        },
        {
            name: "textarea",
            type: "widget:Textarea",
            helpText: "要设置的文本区域"
        }
    ],
    defaults: {},
    label: ([object, textarea]) => (
        <>
            {object} {textarea}
        </>
    ),
    helpText: "为键盘设置文本区域"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 29,
    name: "labelSetText",
    group: "Label",
    properties: [
        {
            name: "object",
            type: "widget:Label",
            helpText: "用于设置文本的标签"
        },
        {
            name: "text",
            type: "string",
            helpText: "要设置的文本"
        }
    ],
    defaults: {},
    label: ([object, text]) => (
        <>
            {object} {text}
        </>
    ),
    helpText: "设置标签文本"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 58,
    name: "qrCodeUpdate",
    displayName: "二维码更新",
    group: "QRCode",
    properties: [
        {
            name: "object",
            type: "widget:QRCode",
            helpText: "二维码控件"
        },
        {
            name: "text",
            type: "string",
            helpText: "要显示的文本"
        }
    ],
    defaults: {},
    label: ([object, text]) => (
        <>
            {object} {text}
        </>
    ),
    helpText: "设置二维码对象的文本"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 30,
    name: "rollerSetSelected",
    group: "Roller",
    properties: [
        {
            name: "object",
            type: "widget:Roller",
            helpText: "用于设置所选项的滚轮"
        },
        {
            name: "selected",
            type: "integer",
            helpText: "所选项目的索引"
        },
        {
            name: "animated",
            type: "boolean",
            helpText: "设置所选项目时使用动画"
        }
    ],
    defaults: {
        animated: true
    },
    label: ([object, selected, animated], [_1, _2, animatedLabel]) => (
        <>
            {object} {selected} <i>{animatedLabel}</i>={animated}
        </>
    ),
    helpText: "设置滚轮的所选项"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 31,
    name: "sliderSetValue",
    group: "Slider",
    properties: [
        {
            name: "object",
            type: "widget:Slider",
            helpText: "用于设置值的滑块"
        },
        {
            name: "value",
            type: "integer",
            helpText: "要设置的值"
        },
        {
            name: "animated",
            type: "boolean",
            helpText: "设置值时使用动画"
        }
    ],
    defaults: {
        animated: true
    },
    label: ([object, value, animated], [_1, _2, animatedLabel]) => (
        <>
            {object} {value} <i>{animatedLabel}</i>={animated}
        </>
    ),
    helpText: "设置滑块值"
});

registerAction({
    id: 56,
    name: "sliderSetValueLeft",
    group: "Slider",
    properties: [
        {
            name: "object",
            type: "widget:Slider",
            helpText: "用于设置值的滑块"
        },
        {
            name: "valueLeft",
            type: "integer",
            helpText: "要设置的左侧值"
        },
        {
            name: "animated",
            type: "boolean",
            helpText: "设置值时使用动画"
        }
    ],
    defaults: {
        animated: true
    },
    label: ([object, valueLeft, animated], [_1, _2, animatedLabel]) => (
        <>
            {object} {valueLeft} <i>{animatedLabel}</i>={animated}
        </>
    ),
    helpText: "为滑块的左旋钮设置新值"
});

registerAction({
    id: 57,
    name: "sliderSetRange",
    group: "Slider",
    properties: [
        {
            name: "object",
            type: "widget:Slider",
            helpText: "用于设置值的进度条"
        },
        {
            name: "min",
            type: "integer",
            helpText: "最小值"
        },
        {
            name: "max",
            type: "integer",
            helpText: "最大值"
        }
    ],
    defaults: {},
    label: ([object, min, max], [_1, _2, _3]) => (
        <>
            {object} {min} {max}
        </>
    ),
    helpText: "设置滑块的最小值和最大值"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 60,
    name: "tabviewSetActiveTab",
    group: "Tabview",
    properties: [
        {
            name: "object",
            type: "widget:Tabview",
            helpText: "用于设置活动选项卡的选项卡视图"
        },
        {
            name: "tab",
            type: "integer",
            helpText: "要激活的选项卡索引（从 0 开始）"
        },
        {
            name: "animated",
            type: "boolean",
            helpText: "切换选项卡时使用动画"
        }
    ],
    defaults: {
        animated: true
    },
    label: ([object, tab, animated], [_1, _2, animatedLabel]) => (
        <>
            {object} {tab} <i>{animatedLabel}</i>={animated}
        </>
    ),
    helpText: "设置选项卡视图的活动选项卡"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 61,
    name: "tabviewGetActiveTab",
    group: "Tabview",
    properties: [
        {
            name: "object",
            type: "widget:Tabview",
            helpText: "用于获取活动选项卡的选项卡视图"
        },
        {
            name: "result",
            type: "integer",
            isAssignable: true,
            helpText: "用于存储活动选项卡索引的变量"
        }
    ],
    defaults: {},
    label: ([object, result]) => (
        <>
            {object}
            <RightArrow />
            {result}
        </>
    ),
    helpText: "获取选项卡视图的活动选项卡索引"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 33,
    name: "groupFocusObj",
    group: "Group",
    properties: [
        {
            name: "object",
            type: "widget",
            helpText: "要聚焦的对象"
        }
    ],
    defaults: {},
    label: ([object]) => <>{object}</>,
    helpText: "聚焦对象"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 34,
    name: "groupFocusNext",
    group: "Group",
    properties: [
        {
            name: "group",
            type: "group",
            helpText: "用于聚焦下一个对象的分组"
        }
    ],
    defaults: {},
    label: ([group]) => <>{group}</>,
    helpText: "聚焦分组中的下一个对象"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 35,
    name: "groupFocusPrev",
    group: "Group",
    properties: [
        {
            name: "group",
            type: "group",
            helpText: "用于聚焦上一个对象的分组"
        }
    ],
    defaults: {},
    label: ([group]) => <>{group}</>,
    helpText: "聚焦分组中的上一个对象"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 36,
    name: "groupGetFocused",
    group: "Group",
    properties: [
        {
            name: "group",
            type: "group",
            helpText: "用于获取聚焦对象的分组"
        },
        {
            name: "result",
            type: "widget",
            isAssignable: true,
            helpText: "用于存储聚焦对象的变量"
        }
    ],
    defaults: {
        enabled: true
    },
    label: ([object, result]) => (
        <>
            {object}
            <RightArrow />
            {result}
        </>
    ),
    helpText: "获取分组中聚焦的对象"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 37,
    name: "groupFocusFreeze",
    group: "Group",
    properties: [
        {
            name: "group",
            type: "group",
            helpText: "用于冻结/解冻焦点的分组"
        },
        {
            name: "enabled",
            type: "boolean",
            helpText: "true：冻结，false：解除冻结（正常模式）"
        }
    ],
    defaults: {
        enabled: true
    },
    label: ([group, enabled]) => (
        <>
            {group} {enabled}
        </>
    ),
    helpText: "不允许焦点从当前对象移开"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 38,
    name: "groupSetWrap",
    group: "Group",
    properties: [
        {
            name: "group",
            type: "group",
            helpText: "用于设置循环的分组"
        },
        {
            name: "enabled",
            type: "boolean",
            helpText: "true：循环，false：不循环"
        }
    ],
    defaults: {
        enabled: false
    },
    label: ([group, enabled]) => (
        <>
            {group} {enabled}
        </>
    ),
    helpText:
        "设置焦点下一个/上一个是否允许从第一个→最后一个或最后一个→第一个对象循环。"
});

////////////////////////////////////////////////////////////////////////////////

registerAction({
    id: 39,
    name: "groupSetEditing",
    group: "Group",
    properties: [
        {
            name: "group",
            type: "group",
            helpText: "用于设置编辑模式的分组"
        },
        {
            name: "enabled",
            type: "boolean",
            helpText: "true：编辑模式，false：导航模式"
        }
    ],
    defaults: {
        enabled: true
    },
    label: ([group, enabled]) => (
        <>
            {group} {enabled}
        </>
    ),
    helpText: "手动设置当前模式（编辑或导航）。"
});

////////////////////////////////////////////////////////////////////////////////

const LV_ANIM_PATH_ENUM_NAME = "LV_ANIM_PATH";

registerLvglEnum(LV_ANIM_PATH_ENUM_NAME, {
    LINEAR: 0,
    EASE_IN: 1,
    EASE_OUT: 2,
    EASE_IN_OUT: 3,
    OVERSHOOT: 4,
    BOUNCE: 5
});

const ANIM_PROPERTIES: IActionPropertyDefinition[] = [
    {
        name: "object",
        type: "widget",
        helpText: "要动画的对象"
    },
    {
        name: "start",
        type: "integer",
        helpText: "动画起始值"
    },
    {
        name: "end",
        type: "integer",
        helpText: "动画结束值"
    },
    {
        name: "delay",
        type: "integer",
        helpText: "动画开始前的延迟（毫秒）"
    },
    {
        name: "time",
        type: "integer",
        helpText: "动画持续时间（毫秒）"
    },
    {
        name: "relative",
        type: "boolean",
        helpText:
            "决定 `Start` 和 `End` 值是相对于当前值还是绝对值。"
    },
    {
        name: "instant",
        type: "boolean",
        helpText:
            "勾选后立即应用起始值，否则在动画真正开始时延迟后应用起始值"
    },
    {
        name: "path",
        type: `enum:${LV_ANIM_PATH_ENUM_NAME}`,
        helpText: "动画路径"
    }
];

const ANIM_DEFAULTS = {
    start: 0,
    end: 100,
    delay: 0,
    time: 1000,
    relative: true,
    instant: false,
    path: "LINEAR"
};

const animLabel = (
    [object, start, end, delay, time, relative, instant, path]: string[],
    [
        _1,
        startLabel,
        endLabel,
        delayLabel,
        timeLabel,
        relativeLabel,
        instantLabel,
        _2
    ]: string[]
) => (
    <>
        {object} <i>{startLabel}</i>={start} <i>{endLabel}</i>={end}{" "}
        <i>{delayLabel}</i>={delay} <i>{timeLabel}</i>={time}
        {relative == "ON" ? " RELATIVE" : ""}
        {instant == "ON" ? " INSTANT" : ""} {path}
    </>
);

registerAction({
    id: 40,
    name: "animX",
    group: "Animation",
    properties: ANIM_PROPERTIES,
    defaults: ANIM_DEFAULTS,
    label: animLabel,
    helpText: "对对象 X 坐标进行动画"
});

registerAction({
    id: 41,
    name: "animY",
    group: "Animation",
    properties: ANIM_PROPERTIES,
    defaults: ANIM_DEFAULTS,
    label: animLabel,
    helpText: "对对象 Y 坐标进行动画"
});

registerAction({
    id: 42,
    name: "animWidth",
    group: "Animation",
    properties: ANIM_PROPERTIES,
    defaults: ANIM_DEFAULTS,
    label: animLabel,
    helpText: "对对象宽度进行动画"
});

registerAction({
    id: 43,
    name: "animHeight",
    group: "Animation",
    properties: ANIM_PROPERTIES,
    defaults: ANIM_DEFAULTS,
    label: animLabel,
    helpText: "对对象高度进行动画"
});

registerAction({
    id: 44,
    name: "animOpacity",
    group: "Animation",
    properties: ANIM_PROPERTIES,
    defaults: ANIM_DEFAULTS,
    label: animLabel,
    helpText: "对对象不透明度进行动画"
});

registerAction({
    id: 45,
    name: "animImageZoom",
    group: "Animation",
    properties: ANIM_PROPERTIES,
    defaults: ANIM_DEFAULTS,
    label: animLabel,
    helpText: "对图像缩放进行动画"
});

registerAction({
    id: 46,
    name: "animImageAngle",
    group: "Animation",
    properties: ANIM_PROPERTIES,
    defaults: ANIM_DEFAULTS,
    label: animLabel,
    helpText: "对图像角度进行动画"
});

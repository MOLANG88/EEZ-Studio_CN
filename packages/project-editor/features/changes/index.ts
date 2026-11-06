import {
    ClassInfo,
    EezObject,
    PropertyType,
    registerClass
} from "project-editor/core/object";

import { ChangesState } from "./state";

import { CHANGES_ICON } from "project-editor/ui-components/icons";

import type { ProjectEditorFeature } from "project-editor/store/features";

////////////////////////////////////////////////////////////////////////////////

export class Changes extends EezObject {
    static classInfo: ClassInfo = {
        properties: [],
        icon: CHANGES_ICON
    };

    _state = new ChangesState();
}

registerClass("Changes", Changes);

////////////////////////////////////////////////////////////////////////////////

const feature: ProjectEditorFeature = {
    name: "eezstudio-project-feature-changes",
    version: "0.1.0",
    description: "将项目与以前版本比较",
    author: "EEZ",
    authorLogo: "../eez-studio-ui/_images/eez_logo.png",
    displayName: "更改",
    mandatory: false,
    key: "changes",
    type: PropertyType.Object,
    typeClass: Changes,
    icon: CHANGES_ICON,
    create: () => ({})
};

export default feature;

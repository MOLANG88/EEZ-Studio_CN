import { PropertyType } from "project-editor/core/object";
import type { ProjectEditorFeature } from "project-editor/store/features";

import { Page } from "project-editor/features/page/page";

////////////////////////////////////////////////////////////////////////////////

const feature: ProjectEditorFeature = {
    name: "eezstudio-project-feature-user-widget",
    version: "0.1.0",
    description: "项目的用户控件支持",
    author: "EEZ",
    authorLogo: "../eez-studio-ui/_images/eez_logo.png",
    displayName: "用户控件",
    mandatory: true,
    key: "userWidgets",
    type: PropertyType.Array,
    typeClass: Page,
    icon: "svg:user_widgets",
    create: () => []
};

export default feature;

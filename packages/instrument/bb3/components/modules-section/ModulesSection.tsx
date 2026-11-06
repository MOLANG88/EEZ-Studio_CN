import React from "react";
import { observer } from "mobx-react";

import { Loader } from "eez-studio-ui/loader";

import { BB3Instrument } from "instrument/bb3/objects/BB3Instrument";
import { Section } from "instrument/bb3/components/Section";
import { ModuleItem } from "instrument/bb3/components/modules-section/ModuleItem";
import { InstrumentAppStore } from "instrument/window/app-store";

export const ModulesSection = observer(
    ({
        bb3Instrument,
        appStore
    }: {
        bb3Instrument: BB3Instrument;
        appStore: InstrumentAppStore;
    }) => {
        const isConnected = bb3Instrument.instrument.isConnected;

        let body;

        if (bb3Instrument.refreshInProgress) {
            body = <Loader />;
        } else if (bb3Instrument.modules) {
            body = (
                <>
                    <table className="table mb-0 border EezStudio_Table">
                        <thead>
                            <tr>
                                <th>插槽 #</th>
                                <th>型号</th>
                                <th>修订</th>
                                <th>固件</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bb3Instrument.modules.map(module => (
                                <ModuleItem
                                    key={module.slotIndex}
                                    module={module}
                                />
                            ))}
                        </tbody>
                    </table>
                    {isConnected && (
                        <button
                            className="btn btn-primary"
                            onClick={bb3Instrument.uploadPinoutPages}
                            style={{ marginTop: 20 }}
                            disabled={bb3Instrument.busy}
                        >
                            上传引脚图页面
                        </button>
                    )}
                </>
            );
        } else {
            body = (
                <div className="alert alert-danger" role="alert">
                    从仪器获取模块信息失败！
                </div>
            );
        }

        return <Section title="模块" body={body} />;
    }
);

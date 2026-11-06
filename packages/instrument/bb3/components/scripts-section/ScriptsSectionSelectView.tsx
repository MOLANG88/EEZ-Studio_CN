import React from "react";
import { action } from "mobx";
import { observer } from "mobx-react";

import { BB3Instrument } from "instrument/bb3/objects/BB3Instrument";

export const ScriptsSectionSelectView = observer(
    ({ bb3Instrument }: { bb3Instrument: BB3Instrument }) => {
        if (bb3Instrument.allScriptsCollection.length == 0) {
            return null;
        }

        return (
            <label className="form-check-label">
                <select
                    className="form-select form-control-sm"
                    value={bb3Instrument.selectedScriptsCollectionType}
                    onChange={action(
                        (event: React.ChangeEvent<HTMLSelectElement>) => {
                            bb3Instrument.selectedScriptsCollectionType = event
                                .currentTarget.value as any;
                        }
                    )}
                >
                    <option value="allScriptsCollection">
                        All ({bb3Instrument.allScriptsCollection.length})
                    </option>
                    {bb3Instrument.catalogScriptsCollection.length > 0 && (
                        <option value="catalogScriptsCollection">
                            来自目录（
                            {bb3Instrument.catalogScriptsCollection.length})
                        </option>
                    )}
                    {bb3Instrument.instrumentScriptsCollection.length > 0 && (
                        <option value="instrumentScriptsCollection">
                            在仪器上（
                            {bb3Instrument.instrumentScriptsCollection.length})
                        </option>
                    )}
                    {bb3Instrument.notInstalledCatalogScriptsCollection.length >
                        0 && (
                        <option value="notInstalledCatalogScriptsCollection">
                            未从目录安装（
                            {
                                bb3Instrument
                                    .notInstalledCatalogScriptsCollection.length
                            }
                            )
                        </option>
                    )}
                    {bb3Instrument.installedCatalogScriptsCollection.length >
                        0 && (
                        <option value="installedCatalogScriptsCollection">
                            从目录安装（
                            {
                                bb3Instrument.installedCatalogScriptsCollection
                                    .length
                            }
                            )
                        </option>
                    )}
                    {bb3Instrument.instrumentScriptsNotInCatalogCollection
                        .length > 0 && (
                        <option value="instrumentScriptsNotInCatalogCollection">
                            在仪器上但非来自目录（
                            {
                                bb3Instrument
                                    .instrumentScriptsNotInCatalogCollection
                                    .length
                            }
                            )
                        </option>
                    )}
                </select>
            </label>
        );
    }
);

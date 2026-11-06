import React from "react";
import { observer } from "mobx-react";

import { Toolbar } from "eez-studio-ui/toolbar";
import { ButtonAction } from "eez-studio-ui/action";
import type { IChartsController } from "eez-studio-ui/chart/chart";

////////////////////////////////////////////////////////////////////////////////

interface IWaveform {
    openConfigurationDialog?: () => void;
}

export interface IToolbarOptions {
    showConfigureButton: boolean;
}

export const WaveformToolbar = observer(
    class WaveformToolbar extends React.Component<
        {
            chartsController: IChartsController;
            waveform: IWaveform;
            options?: IToolbarOptions;
        },
        {}
    > {
        configureChart = () => {
            if (this.props.waveform.openConfigurationDialog) {
                this.props.waveform.openConfigurationDialog();
            }
        };

        render() {
            return (
                <React.Fragment>
                    <Toolbar>
                        {this.props.waveform.openConfigurationDialog &&
                            (!this.props.options ||
                                this.props.options.showConfigureButton) && (
                                <ButtonAction
                                    text="配置"
                                    className="btn-primary"
                                    title="配置图表"
                                    onClick={this.configureChart}
                                />
                            )}
                    </Toolbar>
                    <Toolbar>
                        <ButtonAction
                            text="缩放至合适"
                            className="btn-secondary"
                            title="缩放至合适"
                            onClick={this.props.chartsController.zoomAll}
                        />
                        <ButtonAction
                            text="缩放 100%"
                            className="btn-secondary"
                            title="缩放 100%（每个样本 1 像素）"
                            onClick={this.props.chartsController.zoomDefault}
                        />
                    </Toolbar>
                </React.Fragment>
            );
        }
    }
);

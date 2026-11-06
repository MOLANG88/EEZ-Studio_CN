import React from "react";
import { observer } from "mobx-react";

import { Loader } from "eez-studio-ui/loader";
import {
    PropertyList,
    StaticProperty,
    TextInputProperty,
    BooleanProperty
} from "eez-studio-ui/properties";
import { AlertDanger } from "eez-studio-ui/alert";
import { Toolbar } from "eez-studio-ui/toolbar";
import { ButtonAction } from "eez-studio-ui/action";
import * as notification from "eez-studio-ui/notification";

import { ConnectionProperties } from "instrument/window/connection-dialog";
import { InstrumentObject } from "instrument/instrument-object";

import { ConnectionParameters } from "instrument/connection/interface";

import type * as CatalogModule from "home/extensions-manager/catalog";
import type * as ExtensionManagerModule from "home/extensions-manager/extensions-manager";
import type { InstrumentsStore } from "home/instruments";

////////////////////////////////////////////////////////////////////////////////

export const InstrumentToolbar = observer(
    class InstrumentToolbar extends React.Component<{
        instrument: InstrumentObject;
        instrumentsStore: InstrumentsStore;
    }> {
        onOpenInTab = () => {
            this.props.instrument.openEditor("tab");
        };

        onOpenInWindow = () => {
            this.props.instrument.openEditor("window");
        };

        onDelete = () => {
            window.postMessage(
                {
                    type: "delete-instrument",
                    instrumentId: this.props.instrument.id
                },
                "*"
            );
        };

        render() {
            return (
                <Toolbar>
                    {this.props.instrument.isUnknownExtension && (
                        <ButtonAction
                            text="安装扩展"
                            title="为此仪器安装扩展"
                            className="btn btn-default btn-primary"
                            onClick={() =>
                                installExtension(this.props.instrument)
                            }
                        />
                    )}
                    {!this.props.instrumentsStore.selectInstrument && (
                        <ButtonAction
                            text="在选项卡中打开"
                            title="在新选项卡中打开仪器"
                            className="btn btn-secondary"
                            onClick={this.onOpenInTab}
                        />
                    )}
                    {!this.props.instrumentsStore.selectInstrument && (
                        <ButtonAction
                            text="在新窗口打开"
                            title="在新窗口打开仪器"
                            className="btn btn-secondary"
                            onClick={this.onOpenInWindow}
                        />
                    )}
                    <ButtonAction
                        text="删除"
                        title="删除仪器"
                        className="btn btn-danger"
                        onClick={this.onDelete}
                    />
                </Toolbar>
            );
        }
    }
);

////////////////////////////////////////////////////////////////////////////////

export const InstrumentProperties = observer(
    class InstrumentProperties extends React.Component<{
        instrument: InstrumentObject;
    }> {
        render() {
            return <Properties instrument={this.props.instrument} />;
        }
    }
);

////////////////////////////////////////////////////////////////////////////////

export const InstrumentConnection = observer(
    class InstrumentConnection extends React.Component<{
        instrument: InstrumentObject;
    }> {
        render() {
            return <Connection instrument={this.props.instrument} />;
        }
    }
);

////////////////////////////////////////////////////////////////////////////////

export const ConnectionParametersDetails = observer(
    class ConnectionParametersDetails extends React.Component<{
        instrument: InstrumentObject;
    }> {
        render() {
            const { instrument } = this.props;

            if (instrument.lastConnection) {
                if (instrument.lastConnection.type === "ethernet") {
                    return (
                        <PropertyList>
                            <StaticProperty name="接口" value="Ethernet" />
                            <StaticProperty
                                name="服务器地址"
                                value={
                                    instrument.lastConnection.ethernetParameters
                                        .address
                                }
                            />
                            <StaticProperty
                                name="端口"
                                value={instrument.lastConnection.ethernetParameters.port.toString()}
                            />
                        </PropertyList>
                    );
                } else if (instrument.lastConnection.type === "serial") {
                    return (
                        <PropertyList>
                            <StaticProperty name="接口" value="Serial" />
                            <StaticProperty
                                name="端口"
                                value={
                                    instrument.lastConnection.serialParameters
                                        .port
                                }
                            />
                            <StaticProperty
                                name="波特率"
                                value={instrument.lastConnection.serialParameters.baudRate.toString()}
                            />
                            <StaticProperty
                                name="数据位"
                                value={instrument.lastConnection.serialParameters.dataBits.toString()}
                            />
                            <StaticProperty
                                name="停止位"
                                value={instrument.lastConnection.serialParameters.stopBits.toString()}
                            />
                            <StaticProperty
                                name="奇偶校验"
                                value={
                                    instrument.lastConnection.serialParameters
                                        .parity
                                }
                            />
                            <StaticProperty
                                name="流控制"
                                value={
                                    instrument.lastConnection.serialParameters
                                        .flowControl
                                }
                            />
                        </PropertyList>
                    );
                } else if (instrument.lastConnection.type === "usbtmc") {
                    return (
                        <PropertyList>
                            <StaticProperty name="接口" value="USBTMC" />
                            <StaticProperty
                                name="供应商 ID"
                                value={
                                    "0x" +
                                    instrument.lastConnection.usbtmcParameters.idVendor.toString(
                                        16
                                    )
                                }
                            />
                            <StaticProperty
                                name="产品 ID"
                                value={
                                    "0x" +
                                    instrument.lastConnection.usbtmcParameters.idProduct.toString(
                                        16
                                    )
                                }
                            />
                        </PropertyList>
                    );
                } else if (instrument.lastConnection.type === "web-simulator") {
                    return (
                        <PropertyList>
                            <StaticProperty
                                name="接口"
                                value="WebSimulator"
                            />
                        </PropertyList>
                    );
                } else if (instrument.lastConnection.type === "visa") {
                    return (
                        <PropertyList>
                            <StaticProperty name="接口" value="VISA" />
                            <StaticProperty
                                name="资源"
                                value={
                                    instrument.lastConnection.visaParameters
                                        .resource
                                }
                            />
                        </PropertyList>
                    );
                }
            }
            return null;
        }
    }
);

////////////////////////////////////////////////////////////////////////////////

export async function installExtension(instrument: InstrumentObject) {
    const { extensionsCatalog } =
        require("home/extensions-manager/catalog") as typeof CatalogModule;

    const extension = extensionsCatalog.catalog.find(
        extension => extension.id === instrument.extension!.id
    );
    if (extension) {
        const progressToastId = notification.info("正在安装...", {
            autoClose: false
        });

        const { downloadAndInstallExtension } =
            require("home/extensions-manager/extensions-manager") as typeof ExtensionManagerModule;

        await downloadAndInstallExtension(extension, progressToastId);

        notification.update(progressToastId, {
            render: "扩展已成功安装！",
            type: notification.SUCCESS,
            autoClose: 500
        });
    } else {
        notification.error("未找到仪器扩展！");
    }
}

////////////////////////////////////////////////////////////////////////////////

const Properties = observer(
    class Properties extends React.Component<
        {
            instrument: InstrumentObject;
        },
        {}
    > {
        render() {
            const extension = this.props.instrument.extension;
            if (!extension) {
                return null;
            }

            return (
                <PropertyList>
                    <StaticProperty
                        name="仪器"
                        value={extension!.displayName || extension!.name}
                    />
                    <StaticProperty
                        name="ID"
                        value={this.props.instrument.id}
                    />
                    <TextInputProperty
                        name="标签"
                        value={this.props.instrument.label || ""}
                        onChange={value =>
                            this.props.instrument.setLabel(value)
                        }
                    />
                    <StaticProperty
                        name="IDN"
                        value={this.props.instrument.idn || ""}
                    />
                    <BooleanProperty
                        name="自动连接"
                        value={this.props.instrument.autoConnect}
                        onChange={value =>
                            this.props.instrument.setAutoConnect(value)
                        }
                    />
                </PropertyList>
            );
        }
    }
);

////////////////////////////////////////////////////////////////////////////////

const Connection = observer(
    class Connection extends React.Component<{
        instrument: InstrumentObject;
    }> {
        connectionParameters: ConnectionParameters | null;

        dismissError = () => {
            this.props.instrument.connection.dismissError();
        };

        render() {
            let { instrument } = this.props;

            let connection = this.props.instrument.connection;

            let info;
            let error;
            let connectionParameters;
            let button;

            if (connection) {
                if (connection.isIdle) {
                    error = connection.error && (
                        <AlertDanger onDismiss={this.dismissError}>
                            {connection.error}
                        </AlertDanger>
                    );

                    connectionParameters = (
                        <ConnectionProperties
                            connectionParameters={instrument.getConnectionParameters(
                                [
                                    instrument.lastConnection,
                                    this.connectionParameters,
                                    instrument.defaultConnectionParameters
                                ]
                            )}
                            onConnectionParametersChanged={(
                                connectionParameters: ConnectionParameters
                            ) => {
                                this.connectionParameters =
                                    connectionParameters;
                            }}
                            availableConnections={
                                this.props.instrument.availableConnections
                            }
                            serialBaudRates={
                                this.props.instrument.serialBaudRates
                            }
                        />
                    );

                    button = (
                        <button
                            className="btn btn-success"
                            onClick={() => {
                                if (this.connectionParameters) {
                                    this.props.instrument.setConnectionParameters(
                                        this.connectionParameters
                                    );
                                    this.connectionParameters = null;
                                } else if (!instrument.lastConnection) {
                                    this.props.instrument.setConnectionParameters(
                                        instrument.defaultConnectionParameters
                                    );
                                }
                                connection!.connect();
                            }}
                        >
                            连接
                        </button>
                    );
                } else {
                    if (connection.isTransitionState) {
                        info = <Loader className="mb-2" />;
                    }

                    connectionParameters = (
                        <ConnectionParametersDetails
                            instrument={this.props.instrument}
                        />
                    );

                    if (connection.isConnected) {
                        button = (
                            <button
                                className="btn btn-danger"
                                onClick={() => connection!.disconnect()}
                            >
                                断开
                            </button>
                        );
                    } else {
                        button = (
                            <button
                                className="btn btn-danger"
                                onClick={() => connection!.disconnect()}
                            >
                                中止
                            </button>
                        );
                    }
                }
            }

            return (
                <div>
                    <div>
                        {info}
                        {error}
                        {connectionParameters}
                        <div className="text-left">{button}</div>
                    </div>
                </div>
            );
        }
    }
);

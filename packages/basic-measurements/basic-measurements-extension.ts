import {
    IExtensionDefinition,
    IFieldProperties
} from "eez-studio-shared/extensions/extension";

const fftParametersDescription: IFieldProperties[] = [
    // {
    //     name: "windowSize",
    //     displayName: "Size",
    //     type: "enum",
    //     defaultValue: 65536,
    //     enumItems: [...Array(17).keys()].map(x => Math.pow(2, 7 + x))
    // },
    // {
    //     name: "windowFunction",
    //     displayName: "Function",
    //     type: "enum",
    //     defaultValue: "rectangular",
    //     enumItems: [
    //         { id: "rectangular", label: "Rectangular window" },
    //         { id: "hamming", label: "Hamming window" },
    //         { id: "hann", label: "Hanning window" },
    //         { id: "blackman", label: "Blackman window" },
    //         { id: "blackman_harris", label: "Blackman-Harris window" },
    //         { id: "gaussian-2.5", label: "Gaussian (a=2.5) window" },
    //         { id: "gaussian-3.5", label: "Gaussian (a=3.5) window" },
    //         { id: "gaussian-4.5", label: "Gaussian (a=4.5) window" }
    //     ]
    // },
    // {
    //     name: "resample",
    //     displayName: "Resample",
    //     type: "range",
    //     defaultValue: 1,
    //     minValue: 1,
    //     maxValue: 100
    // },
    {
        name: "xAxis",
        displayName: "X 轴",
        type: "enum",
        defaultValue: "logarithmic",
        enumItems: [
            { id: "logarithmic", label: "对数" },
            { id: "linear", label: "线性" },
            { id: "harmonics", label: "谐波" }
        ]
    },
    {
        name: "yAxis",
        displayName: "Y 轴",
        type: "enum",
        defaultValue: "decibel",
        enumItems: [
            { id: "decibel", label: "分贝" },
            { id: "linear", label: "线性" }
        ]
    },
    {
        name: "numHarmonics",
        displayName: "谐波数",
        type: "number",
        defaultValue: 40,
        visible: values => {
            return values.xAxis === "harmonics";
        }
    }
];

const basicMeasurementsExtension: IExtensionDefinition = {
    preInstalled: true,
    extensionType: "measurement-functions",

    measurementFunctions: [
        {
            id: "min",
            name: "最小值",
            script: "min.js"
        },
        {
            id: "max",
            name: "最大值",
            script: "max.js"
        },
        {
            id: "peak-to-peak",
            name: "峰峰值",
            script: "peak-to-peak.js"
        },
        {
            id: "average",
            name: "平均",
            script: "average.js"
        },
        {
            id: "period",
            name: "周期",
            script: "period.js"
        },
        {
            id: "frequency",
            name: "频率",
            script: "frequency.js"
        },
        {
            id: "fft",
            name: "FFT",
            script: "fft.js",
            parametersDescription: fftParametersDescription,
            resultType: "chart"
        },
        {
            id: "add",
            name: "A + B",
            script: "add.js",
            arity: 2,
            resultType: "chart"
        },
        {
            id: "sub",
            name: "A - B",
            script: "sub.js",
            arity: 2,
            resultType: "chart"
        }
        // {
        //     id: "acActivePower",
        //     name: "AC Active Power",
        //     script: "ac_active.js",
        //     arity: 2
        // },
        // {
        //     id: "acReactivePower",
        //     name: "AC Reactive Power",
        //     script: "ac_reactive.js",
        //     arity: 2
        // },
        // {
        //     id: "acApparentPower",
        //     name: "AC Apparent Power",
        //     script: "ac_apparent.js",
        //     arity: 2
        // }
    ]
};

export default basicMeasurementsExtension;

import * as Loader from "../assets/loader.js";
import { Add_Gatepass } from "./pages/add_gatepass.js";
import { Add_Six_R } from "./pages/add_six_r.js";
import { Digital_Payment, Success, Generated_Digital_Payment } from "./pages/payment.js";
import { Generated_NineR, List_Entries, List_Gatepasses } from "./pages/listentries.js";
import { Login } from "./pages/login.js";
import { NineR } from "./pages/niner.js";
import { NineRSubmit } from "./pages/ninersubmit.js";
import { PrintNinerR } from "./pages/print9r.js";
import { PrintGatePass } from "./pages/printgatepass.js";

const CommonDiv = '#content > div > div';
const PrintDiv = '#content';
const LoginDiv = '.box-login';

// const baseUrl = "https://unity-hub.onrender.com/api";
const baseUrl = "http://localhost:8080/api";

const getUrl = (path) => (`${baseUrl}/${path}`);

export const RouteMap = {
    add_six_r: { Script: Add_Six_R, Div: CommonDiv },
    NineR: { Script: NineR, Div: CommonDiv },
    NineRSubmit: { Script: NineRSubmit, Div: CommonDiv },
    add_gatepass: { Script: Add_Gatepass, Div: CommonDiv },
    print_9R: { Script: PrintNinerR, Div: PrintDiv },
    print_gatepass: { Script: PrintGatePass, Div: PrintDiv },
    DigitalPayment: { Script: Digital_Payment, Div: CommonDiv },
    GeneratedDigitalPayment: { Script: Generated_Digital_Payment, Div: CommonDiv },
    DigitalPaymentList: { Script: List_Entries, Div: CommonDiv },
    generated_gatepass: { Script: List_Gatepasses, Div: CommonDiv },
    generated_9R: { Script: Generated_NineR, Div: CommonDiv },
    generated_6R: { Script: List_Entries, Div: CommonDiv },
    index: { Script: Login, Div: LoginDiv },
    Account: { Script: Login, Div: LoginDiv },
    Success: { Script: Success, Div: CommonDiv }
}

export const FetchParams = {
    Post: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    },
    Patch: {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    },
    PostUrlEncoded: {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }
}

export const Url = {
    FinalizeRecord: getUrl('gatepasses/finalize'),
    PeekRecord: getUrl('gatepasses/peek'),
    sendNiner: getUrl('emandi/niners'),
    sendGatepass: getUrl('emandi/gatepasses'),
    ResolveCaptcha: getUrl('imaging/captcha'),
    GetS3File: getUrl('s3/get')
}

export const HttpMessages = {
    400: "Unable to fetch data, Bad Request!",
    401: "Authentication error, Check request!",
    404: "Requested resource not found!",
    204: "No content is available!",
    500: "Something went wrong on server!",
    413: "Content too large to send to server!"
}

export const Messages = {
    SixRCreated: '6R Created Successfully.\nHeading To Payment...',
    GatepassCreated: 'Gatepass Created Successfully!',
    QuantitySelected: (qty = '') => `Quantity Selected : ${qty} Quintal!`,
    NinerCreated: 'Niner Created Successfully!',
    CaptchaResolutionFailed: (message = '') => `Captcha Resolution Failed: ${message}`,
    CheckRequiredFields: 'Check All Required Fields!',
    ReceiptActionFailed: 'Some Reciept Action Failed!',
    NoGatepassQueued: 'No Gatepass Queued!',
    LoadingImages: 'Loading Images...',
    LoadingVehicleImage: 'Loading Vehicle Image...',
    LoadingNumberPlateImage: 'Loading Number Plate Image...',
    GatepassNumberRequired: 'Gatepass Number Is Required.',
    UnableToValidateGatepass: 'Unable To Validate Gatepass Number.',
    ImagesReadyNext: 'Images Ready, Click Next To Continue.',
    ImagesReadyEnterGatepass: 'Images Ready, Enter Gatepass Number To Continue.',
    ImagesNotAvailableManual: 'Images Not Available, Choose Manually.',
    FetchingImages: 'Fetching Images, Please Wait...',

    // Alert & Toast Messages
    ScriptReady: 'Script Ready...',
    VehicleTagged: 'Vehicle Tagged Successfully!',
    GatepassProvisioned: 'Gatepass Provisioned Successfully!',
    NinerProcessed: 'Niner Processed Successfully!',
    GatepassProcessed: 'Gatepass Processed Successfully!',
    NoPaid9RFound: 'No Paid Niner Found!',
    NoPaid6RFound: 'No Paid SixR found!',
    NinerNumberNotAvailable: 'Niner Number Not Available!',
    NinerIdNotAvailable: 'Niner Id Not Available!',
    GatepassNumberNotAvailable: 'Gatepass Number Not Available!',
    GatepassIdNotAvailable: 'Gatepass Id Not Available!',
    InvalidCaptcha: 'Invalid Captcha! Reloading...',
    WeightNotProvided: 'Weight Not Provided!',
    QuantityUnavailable: 'Quantity Unavailable!\nSelect Manually...',
    NoPaymentsPending: 'No Payments Pending!',
    ConfirmPrint: 'Are You Sure To Print?',

    // Loader & Spinner Messages
    ProcessingNiner: 'Processing Niner...',
    ProcessingGatepass: 'Processing Gatepass...',
    FetchingRecords: 'Fetching Records...',
    TaggingVehicle: 'Tagging Vehicle...',
    SendingNiner: 'Sending Niner...',
    SendingGatepass: 'Sending Gatepass...',
    FinalizingRecord: 'Finalizing Record...',
    CheckingQueue: 'Checking Queue...',
    PleaseWait: 'Please Wait...',
    ResolvingCaptcha: 'Resolving Captcha...'
}

export const Labels = {
    // Button Labels
    Next: 'Next',
    Review: 'Review',
    TagVehicle: 'Tag Vehicle',
    Finalize: 'Finalize',
    ChooseAnImage: 'Choose an image',

    // Input & Field Labels / Placeholders
    GatepassNumber: 'Gatepass Number',

    // Vehicle Tagging Modal Steps & Labels
    ValidateGatepass: 'Validate Gatepass',
    VehicleTagging: 'Vehicle Tagging',
    NumberPlateTagging: 'Number Plate Tagging',
    SelectLocation: 'Select Location',
    ReviewVehicleTagging: 'Review Vehicle Tagging',
    FinalizeDirectly: 'Finalize The Record Directly.',
    GatepassValidatedFor: 'Gatepass Validated For'
}

export const Icon = {
    success: Loader.Success,
    error: Loader.Error,
    info: Loader.Info
}

export const MessageType = {
    Success: 'success',
    Error: 'error',
    Info: 'info'
}

export const StageMap = {
    SixR: {
        Url: '/Traders/add_six_r'
    },
    Payment: {
        Url: '/Traders/DigitalPayment',
    },
    NineR: {
        Url: '/Traders/NineR',
    },
    Gatepass: {
        Url: '/Traders/add_gatepass',
    }
}

export const Stages = {
    SixR: 'SixR',
    Payment: 'Payment',
    NineR: 'NineR',
    Gatepass: 'Gatepass'
}

export const ItemsToHide = [
    '[href="/MultiCommodity/Index"]',
    '[href="/Traders/Niner2Dashboard"]',
    '[href="/MultiCommodity/add_gatepass"]',
    '[href="/Exemption/ExemptionDashboard"]',
    '[href="/Stock/AvailableStock"]',
    '[href="/Stock/Stocks"]',
    '[href="/Traders/TraderAutogeneratedgatepas"]'
];

export const backendBaseUrl = new URL(baseUrl).origin;

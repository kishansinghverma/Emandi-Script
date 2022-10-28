export const RunBasicCustomizations = () => {
    document.querySelector('[href="/Traders/NinerDashboard"]').setAttribute('href', '/Traders/NineR');
    document.querySelector('[href="/MultiCommodity/Index"]').style.display = 'none';
    document.querySelector('[href="/Traders/Niner2Dashboard"]').style.display = 'none';
    document.querySelector('[href="/MultiCommodity/add_gatepass"]').style.display = 'none';
    document.querySelector('[href="/Exemption/ExemptionDashboard"]').style.display = 'none';
    document.querySelector('[href="/Stock/AvailableStock"]').style.display = 'none';
    document.querySelector('[href="/Stock/Stocks"]').style.display = 'none';
    document.querySelector('[href="/Traders/PreArrivalOuterList"]').style.display = 'none';
    document.querySelector('[href="/Traders/DCDashboard"]').style.display = 'none';
}
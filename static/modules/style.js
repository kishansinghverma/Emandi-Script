export const CSS = `
input[type='radio']:checked+label { 
    font-weight: bold !important; 
}

#entries {
    display: flex; 
    flex-wrap: wrap;
}

.modal-content > hr { 
    width: 0px; 
    margin: 3px; 
}

.head { 
    display: flex; 
    justify-content: space-between; 
    margin-bottom: 4px 
}

.custom-modal > div.head > button { 
    margin-top: -4px; 
    border-radius: 8px; 
    color: red; 
    background-color: white !important; 
}

.modal-container{
    width: 100%;
    display: flex;
    justify-content: center;
}

.custom-modal { 
    display: block; 
    padding: 10px; 
    border-radius:4px; 
    position: fixed;
    top: 0;
    margin-top: 200px;
    z-index: 100;
    background-color: rgb(0 0 0 / 70%); 
}

.modal-content{ 
    border-radius:4px; 
    padding: 20px; 
    border: 1px solid #888; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center; 
}

.buttons{
    margin-top: 5px;
    display: flex;
    justify-content: space-around;
    width: 100%;
}

h4{
    margin: -8px 0px 2px 0px;
    cursor: pointer;
}

h4:hover {
    text-shadow: 0 0 10px black;
}
`
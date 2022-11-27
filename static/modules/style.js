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

#modalContent > div.buttons > button.btn-info {
    margin-right: 5px;
}

#modalContent > div.buttons > button.btn-success {
    margin-left: 5px;
}

h4{
    margin: -8px 0px 2px 0px;
    cursor: pointer;
}

h4:hover {
    text-shadow: 0 0 10px black;
}

#loader {
    position: relative;
    width: 100px;
    height: 12px;
  }
  #loader div {
    width: 12px;
    height: 12px;
    background: #c75119f2;
    border-radius: 50%;
    position: absolute; 
  }
  #d1 { animation: animate 2s linear infinite;}
  #d2 { animation: animate 2s linear infinite -.4s; }
  #d3 {animation: animate 2s linear infinite -.8s; }
  #d4 { animation: animate 2s linear infinite -1.2s; } 
  #d5 { animation: animate 2s linear infinite -1.6s; }
  @-webkit-keyframes animate {
    0% { left: 100px; top:0}
    80% { left: 0; top:0;}
    85% { left: 0; top: -20px; width: 12px; height: 12px;}
    90% { width: 12px; height: 12px; }
    95% { left: 100px; top: -20px; width: 12px; height: 12px;}
    100% { left: 100px; top:0; }
  }
`
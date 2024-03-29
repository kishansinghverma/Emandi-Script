export const CSS = `
input[type='radio']:checked+label { 
    font-weight: bold !important; 
}

#entries {
    display: flex; 
    flex-wrap: wrap;
}

.custom-modal-content > hr { 
    width: 0px; 
    margin: 3px; 
}

.head { 
    display: flex; 
    justify-content: space-between; 
    margin-bottom: 4px 
}

.btn-close { 
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #ff670eed;
    position: relative;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.btn-close::before,
.btn-close::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 2px;
    background-color: #fff;
    transform: translate(-50%, -50%) rotate(-45deg);
    transition: background-color 0.2s ease;
}

.btn-close::after {
    transform: translate(-50%, -50%) rotate(45deg);
}

.btn-close:hover {
    transform: scale(1.1);
}
  
.btn-close:hover::before,
.btn-close:hover::after {
    background-color: #333;
}

.custom-modal-container{
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
    margin-top: 150px;
    z-index: 100;
    background-color: rgb(0 0 0 / 70%);
    box-shadow: 4px 4px 20px 0px rgb(0 0 0 / 50%);
}

.custom-modal-content{ 
    border-radius:4px; 
    padding: 20px; 
    border: 1px solid #888; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center;
    background-color: #fff;
}

.buttons{
    margin-top: 5px;
    display: flex;
    justify-content: space-around;
    width: 100%;
}

.buttons .btn-info {
    margin-right: 5px;
    border-color: #3189c6;
}

.buttons .btn-info:active {
    margin-right: 5px;
    -webkit-box-shadow: inset 0 3px 5px rgb(0 0 0 / 13%) !important;
    box-shadow: inset 0 3px 5px rgb(0 0 0 / 13%);
}

.buttons .btn-success {
    margin-left: 5px;
    background-color: #5cb85c;
    border-color: #4cae4c;
}

.buttons .btn-success:focus {
    background-color: #449d44 !important;;
    border-color: #398439 !important;;
}

.buttons .btn-success[disabled]:active {
    background-color: #449d44 !important;
    border-color: #398439 !important;
}

.buttons .btn-success:active {
    background-color: #449d44 !important;
    border-color: #398439 !important;
    -webkit-box-shadow: inset 0 3px 5px rgb(0 0 0 / 13%) !important;
    box-shadow: inset 0 3px 5px rgb(0 0 0 / 13%);
}

.buttons .btn-success[disabled]:hover {
    background-color: #5cb85cc9;
    border-color: #4cae4cc2;
}

#expressBtn {
    margin-top: 10px;
    display: none;
}

.buttons .btn-success:hover {
    background-color: #449d44;
    border-color: #398439;
}

h4{
    margin: -8px 0px 2px 0px;
    cursor: pointer;
}

h4:hover {
    text-shadow: 0 0 10px black;
}

#spinner {
    position: relative;
    width: 100px;
    height: 12px;
}

#spinner div {
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

.close-btn {
    position: relative; 
    top: 1px;
    color: #4f4f4f;
    cursor: pointer;
}
.close-btn:hover, .close-btn:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
}

#notification-content {
    display: inline-block;
    white-space: normal;
}

#notification-container.success {
    color: #155724;
    background-color: #d4edda;
    border: 2px solid #c3e6cb;
}
#notification-container.error {
    color: #721c24;
    background-color: #f8d7da;
    border: 2px solid #f5c6cb;
}
#notification-container.info {
    color: #004085;
    background-color: #cce5ff;
    border: 2px solid #b8daff;
}

#notification-container {
    display: none;
    position: fixed;
    top: 12%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    max-width: 90%;
    padding: .75rem 1.25rem;
    border-radius: .25rem;
    text-align: center;
    box-shadow: 2px 17px 20px 1px rgba(0, 0, 0, 0.3);
    animation-name: slideInFade;
    animation-duration: 0.5s;
    white-space: nowrap;
  }
  
  @keyframes slideInFade {
    0% {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      transform: translate(-50%, -50%);
      opacity: 1;
    }
  }
`
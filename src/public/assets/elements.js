export const SendRecieptButton = `<li>
                                        <a href="#" onclick="{ window.commonContext.PrintLastRecords(false); }">
                                            <i class="fa fa-envelope-o"></i>
                                            <span> Send Last Reciepts </span> 
                                        </a>
                                    </li>`;

export const PrintRecieptButton = `<li>
                                        <a href="#" onclick="{ if(confirm('Are You Sure To Print?')) window.commonContext.PrintLastRecords(true); }">
                                            <i class="fa fa-print"></i>
                                            <span> Print Last Reciepts </span> 
                                        </a>
                                    </li>`;

export const NotificationContainer = `<div id="notification-container">
                                        <div id="notification-content" style="display: flex;">
                                            <div id="icon" style="height: 24px; width: 24px;"></div>&nbsp;&nbsp;
                                            <div id="message"></div>&emsp;
                                            <div class="close-btn" onclick="$('#notification-container').fadeOut(200)">&#x2716;</div>
                                        </div>
                                    </div>`;
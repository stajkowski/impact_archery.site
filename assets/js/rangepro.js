apiKey = null;
enabledElements = [];
test = false;
updateInterval = 60;
contentType = null;

$( document ).ready(function()
{
    contentType ="application/x-www-form-urlencoded; charset=utf-8";

    if(window.XDomainRequest) { //for IE8,IE9
        contentType = "text/plain";
    }

    loadData(); //get initial lane status
    setInterval(function(){ loadData(); }, updateInterval * 1000);
});

function constructURL(apiCall)
{
    //construct url for ajax call
    url = 'https://client.range-pro.com/v1/';
    if (test == true) {
        url = 'http://rptest.range-pro.com:9000/v1/';
    }

    //construct the url for each call
    if (apiCall == 'store') {
        url += 'stores/' + apiKey;
    }

    return url;
}

function loadData()
{
    enabledElements.forEach(function(entry) {
        if(entry == 'summary'){
            constructSummaryElement();
        }
    });
}

function formatNumber(num)
{
    //need double digits for number display for consistant layout
    if(num < 10){
        return '0' + num;
    }
    return num;
}

function constructSummaryElement() {

    var rpAPI = constructURL('store');
    var ajaxRequest = $.getJSON(rpAPI)
        .done(function (data) {

            num_waiting = formatNumber(data.store.default_range_waiting);
            num_customer = formatNumber(data.store.default_customers_waiting);
            num_open = formatNumber(data.store.default_range_open);

            html = '<span class="summary-open-lanes-title">OPEN</span>';
            html += '<span class="summary-open-lanes">' + num_open + '</span>';
            html += '<span class="summary-separator"></span>';
            html += '<span class="summary-waitinglist-title">WAITING LIST</span>';
            html += '<span class="summary-waitinglist-customers">' + num_customer + ' CUSTOMER(S)</span>';
            html += '<span class="summary-waitinglist-lanes">' + num_waiting + ' LANE(S)</span>';

            $('#default_range_status').html(html);
            if(num_open <= 4){
                $("#default_range_status").addClass("range-status-busy");
                $("#default_range_status").removeClass("range-status-ok");
            }else{
                $("#default_range_status").addClass("range-status-ok");
                $("#default_range_status").removeClass("range-status-busy");
            }
            /*
            $.each(data.items, function (i, item) {
                $("<img>").attr("src", item.media.m).appendTo("#images");
                if (i === 3) {
                    return false;
                }
            });
            */
    });

}
App = {
    init: function () {
        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            window.web3 = new Web3(web3.currentProvider);
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        }
        App.initContract();
    },

    initContract: function () {
        $.getJSON('Information.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            window.information = TruffleContract(data);
            // Set the provider for our contract
            window.information.setProvider(web3.currentProvider);
            // Init app
            App.sortNewsByScore();
        });
    },
    ///////////////////////////////////////////////////////////////////////////////////////////
    pageCallback: async function(index,jq){
        $("#sortList").html("");
        var pageNum = 10;
        var start = index*pageNum;//开始
        var end = Math.min((index+1)*pageNum,totalNum);
        var content='';
        for(var i=start;i<end;i++){
            var result = await App._getNewsInfo(sortList[i][0]);
            content+=' <div class="row">'
                +'<div class="col-xs-1" id="rank">'+(i+1)+'</div>'
                +'<div class="col-xs-2" id="name">'+ result[1] +'</div>'
                +'<div class="col-xs-4" id="owner">'+result[0]+'</div>'
                +'<div class="col-xs-2" id="date">'+fmtDate(result[6].toString())+'</div>'
                +'<div class="col-xs-1" id="style">'+result[2]+'</div>'
                +'<div class="col-xs-1" id="score">'+ result[5] +'</div>'
                +' <div class="col-xs-1">'
                +'<a href="news.html?id='+sortList[i][0]+'"><img id="cover" style="width: 50px;height: 50px;" src='+result[4]+'/></a>'
                +'</div>'
                +'</div>'
        }
        $("#sortList").append(content);
    },
    /**
     * 资讯评论排名
     * @returns {Promise<void>}
     */
    sortNewsByScore: async function(){
        window.totalNum = await App._getNewsLength();
        window.sortList = new Array();
        var saleTempList = new Array(totalNum);
        for(var i=0;i<totalNum;i++){
            saleTempList[i] = new Array(2);
            var result = await App._getNewsInfo(i);
            saleTempList[i][0]=i;
            saleTempList[i][1]=result[5];
        }
        var newArray = saleTempList.sort(function (a,b) {
            return b[1]-a[1];
        });
        window.sortList = newArray;
        $("#pagination").pagination(totalNum,{
            callback: App.pageCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 10, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },

    /**
     * 资讯时间排名
     * @returns {Promise<void>}
     */
    sortNewsByDate: async function(){
        window.totalNum = await App._getNewsLength();
        window.sortList = new Array();
        var saleTempList = new Array(totalNum);
        for(var i=0;i<totalNum;i++){
            saleTempList[i] = new Array(2);
            var result = await App._getNewsInfo(i);
            saleTempList[i][0]=i;
            saleTempList[i][1]=result[6];
        }
        var newArray = saleTempList.sort(function (a,b) {
            return b[1]-a[1];
        });
        window.sortList = newArray;
        $("#pagination").pagination(totalNum,{
            callback: App.pageCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 10, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },
    /////////////////////////////////////////////////////////////////////////////////
    _getNewsLength: function () {
        return new Promise(function (resolve, reject) {
            information.deployed().then(function (informationInstance) {
                informationInstance.getNewsLength.call().then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },

    _getNewsInfo: function (id) {
        return new Promise(function (resolve, reject) {
            information.deployed().then(function (informationInstance) {
                informationInstance.getNewsInfo.call(id).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    }

}


// timestamp -> yyyy-MM-dd HH:mm:ss
function fmtDate(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y + M + D + h + m + s;
}

$(function () {
    // ##### note #####
    App.init();
    // ##### note #####

    // 激活导航
    $("#newssort-menu").addClass("menu-item-active");
});
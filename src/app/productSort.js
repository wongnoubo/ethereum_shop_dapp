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
        $.getJSON('Store.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            window.store = TruffleContract(data);
            // Set the provider for our contract
            window.store.setProvider(web3.currentProvider);
            // Init app
            // App.sortProductBySales();
        });
    },

    ////////////////////////////////////////////////////////////////////////////////////////
    pageCallback: async function(index,jq){
        $("#bg").hide();
        $("#sortList").html("");
        var pageNum = 10;
        var start = index*pageNum;//开始
        var end = Math.min((index+1)*pageNum,totalNum);
        var content='';
        for(var i=start;i<end;i++){
            var result = await App._getProductInfo(sortList[i][0]);
            content+=' <div class="row">'
                +'<div class="col-xs-1" id="rank">'+(i+1)+'</div>'
                +'<div class="col-xs-1" id="name">'+ result[1] +'</div>'
                +'<div class="col-xs-3" id="owner">'+result[0]+'</div>'
                +'<div class="col-xs-1" id="date">'+fmtDate(result[8].toString())+'</div>'
                +'<div class="col-xs-1" id="style">'+result[2]+'</div>'
                +'<div class="col-xs-1" id="sales">'+result[6]+'</div>'
                +'<div class="col-xs-1" id="score">'+ result[7] +'</div>'
                +'<div class="col-xs-1" id="price">'+result[5]+'</div>'
                +'<div class="col-xs-1" id="all">'+Math.round(Number(result[5]*0.49)+Number(result[6]*0.49)+Number(result[7]*0.02))+'</div>'
                +' <div class="col-xs-1">'
                +'<a href="product.html?id='+sortList[i][0]+'"><img id="cover" style="width: 50px;height: 50px;" src='+result[9]+'/></a>'
                +'</div>'
                +'</div>'
        }
        $("#sortList").append(content);
    },

    /**
     * 销量榜
     * @returns {Promise<void>}
     */
    sortProductBySales: async function(){
        window.totalNum = await App._getProductLength();
        window.sortList = new Array();
        var saleTempList = new Array(totalNum);
        for(var i=0;i<totalNum;i++){
            saleTempList[i] = new Array(2);
            var result = await App._getProductInfo(i);
            saleTempList[i][0]=i;
            saleTempList[i][1]=result[6];
            console.log(saleTempList[i][0]);
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
     * 评论榜
     * @returns {Promise<void>}
     */
    sortProductByComments: async function(){
        window.totalNum = await App._getProductLength();
        window.sortList = new Array();
        var saleTempList = new Array(totalNum);
        for(var i=0;i<totalNum;i++){
            saleTempList[i] = new Array(2);
            var result = await App._getProductInfo(i);
            saleTempList[i][0]=i;
            saleTempList[i][1]=result[7];
            console.log(saleTempList[i][0]);
        }
        var newArray = saleTempList.sort(function (a,b) {
            return b[1]-a[1];
        });
        console.log("ninn  saa "+newArray);
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
     * 价格榜
     * @returns {Promise<void>}
     */
    sortProductByPrices: async function(){
        window.totalNum = await App._getProductLength();
        window.sortList = new Array();
        var saleTempList = new Array(totalNum);
        for(var i=0;i<totalNum;i++){
            saleTempList[i] = new Array(2);
            var result = await App._getProductInfo(i);
            saleTempList[i][0]=i;
            saleTempList[i][1]=result[5];
            console.log(saleTempList[i][0]);
        }
        var newArray = saleTempList.sort(function (a,b) {
            return b[1]-a[1];
        });
        console.log("ninn  saa "+newArray);
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
     * 综合榜
     * @returns {Promise<void>}
     */
    sortProductByAll: async function(){
        window.totalNum = await App._getProductLength();
        window.sortList = new Array();
        var saleTempList = new Array(totalNum);
        for(var i=0;i<totalNum;i++){
            saleTempList[i] = new Array(2);
            var result = await App._getProductInfo(i);
            saleTempList[i][0]=i;
            saleTempList[i][1]=Math.round(Number(result[5]*0.49)+Number(result[6]*0.49)+Number(result[7]*0.02));
            console.log(saleTempList[i][0]);
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


    ///////////////////////////////////////////////////////////////////////////////////////
    _getProductInfo: function (id) {
        return new Promise(function (resolve, reject) {
            store.deployed().then(function (storeInstance) {
                storeInstance.getProductInfo.call(id).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },

    _getProductLength: function () {
        return new Promise(function (resolve, reject) {
            store.deployed().then(function (storeInstance) {
                storeInstance.getProductLength.call().then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    }
}

// timestamp -> yyyy-MM-dd
function fmtDate(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    return Y + M + D;
}


$(function () {
    // ##### note #####
    App.init();
    // ##### note #####

    // 激活导航
    $("#sort-menu").addClass("sort-menu");
});
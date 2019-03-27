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
        });
    },
    ///////////////////////////////////////////////////////////////////////////////////
    /**
     * 根据类型检索资讯
     * @param type
     * @returns {Promise<void>}
     */
    getNewsByType: async function(type){
        var tempNum = await App._getNewsLength();
        var start = 0;
        var tempList = new Array();
        var resultInfo=null;
        for(var i = start;i<tempNum;i++){
            resultInfo = await App._getNewsInfo(i);
            if(resultInfo[2].match(type)==null){
            }else {
                tempList.push(resultInfo);
            }
        }
        window.searchNewsList = tempList;
        window.totalNewsNum = tempList.length;
        $("#pagination").pagination(totalNewsNum, {
            callback: App.pageNewsCallbackSearch,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
        if(tempList.length==0){
            alert("没有找到该类型资讯，请您换个搜索类型( ˶‾᷄࿀‾᷅˵ )");
        }
    },
    /**
     * 检索
     * @param keyword
     * @returns {Promise<void>}
     */
    getNewsByKeyword: async function(keyword){
        var tempNum = await App._getNewsLength();
        var start = 0;
        var tempList = new Array();
        var resultInfo=null;
        for(var i = start;i<tempNum;i++){
            resultInfo = await App._getNewsInfo(i);
            if(resultInfo[1].match(keyword)==null){
            }else {
                tempList.push(resultInfo);
            }
        }
        window.searchNewsList = tempList;
        window.totalNewsNum = tempList.length;
        $("#pagination").pagination(totalNewsNum, {
            callback: App.pageNewsCallbackSearch,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
        if(tempList.length==0){
            alert("没有找到该资讯相关信息，请您换个搜索关键词( ˶‾᷄࿀‾᷅˵ )");
        }
    },
    /**
     * 我发布的资讯
     * @param index
     * @param jq
     * @returns {Promise<void>}
     */
    getPublishedNews: async function(){
      var result = await App._getPublishedNews();
      window.newsList = result;
      window.totalNewsNum = result.length;
        $("#pagination").pagination(totalNewsNum, {
            callback: App.pageNewsCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },

    /**
     * 我评论的资讯
     * @param index
     * @param jq
     * @returns {Promise<void>}
     */
    getCommentedNews: async function(){
        var result = await App._getCommentedNews();
        window.newsList = result;
        window.totalNewsNum = result.length;
        console.log(totalNewsNum);
        $("#pagination").pagination(totalNewsNum, {
            callback: App.pageNewsCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },


    pageNewsCallback: async function (index, jq) {
        $("#bg").hide();
        $("#Viewnews").html('');
        var pageNum = 8;
        var start = index * pageNum; // 开始
        var end = Math.min((index + 1) * pageNum, totalNewsNum); // 结束
        var content = '';
        for (var i = start; i < end; i++) {
            var result = await App._getNewsInfo(newsList[i]);
            content += '<div class="col-sm-6 col-md-3" >'
                + '<div class="thumbnail">'
                + '<a href="news.html?id=' + i + '">'
                + '<div style="position: relative;">'
                + '<img id="newscover" class="img-cover" src="' + result[4] + '" alt="资讯封面"/>'
                + '<figcaption id="newstitle" class="img-caption">' + result[1] + '</figcaption>'
                + '</div>'
                + '</a>'
                + '<div class="caption">'
                +'<span class="label label-info">评分</span>'
                +'<samp id="newsscore">' + result[5] + '</samp>'
                +'<br/>'
                + '<span class="label label-info">类型</span>'
                + '<samp id="newsstyle">' + result[2] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">文本</span>'
                + '<samp id="newstext">' + result[3].substr(0, 20) + '......</samp>'
                + '<br/>'
                + '</div>'
                + '</div>'
                + '</div>';
        }
        $("#Viewnews").append(content);
    },

    pageNewsCallbackSearch: async function (index, jq) {
        $("#bg").hide();
        $("#Viewnews").html('');
        var pageNum = 8;
        var start = index * pageNum; // 开始
        var end = Math.min((index + 1) * pageNum, totalNewsNum); // 结束
        var content = '';
        for (var i = start; i < end; i++) {
            var result = searchNewsList[i];
            content += '<div class="col-sm-6 col-md-3" >'
                + '<div class="thumbnail">'
                + '<a href="news.html?id=' + i + '">'
                + '<div style="position: relative;">'
                + '<img id="newscover" class="img-cover" src="' + result[4] + '" alt="资讯封面"/>'
                + '<figcaption id="newstitle" class="img-caption">' + result[1] + '</figcaption>'
                + '</div>'
                + '</a>'
                + '<div class="caption">'
                +'<span class="label label-info">评分</span>'
                +'<samp id="newsscore">' + result[5] + '</samp>'
                +'<br/>'
                + '<span class="label label-info">类型</span>'
                + '<samp id="newsstyle">' + result[2] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">文本</span>'
                + '<samp id="newstext">' + result[3].substr(0, 20) + '......</samp>'
                + '<br/>'
                + '</div>'
                + '</div>'
                + '</div>';
        }
        $("#Viewnews").append(content);
    },

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 我发布的资讯
     * @returns {Promise<any>}
     * @private
     */
    _getPublishedNews: function () {
        return new Promise(function (resolve, reject) {
            information.deployed().then(function (informationInstance) {
                informationInstance.getPublishedNews.call().then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },
    /**
     * 我评论过的资讯
     * @private
     */
    _getCommentedNews: function () {
        return new Promise(function (resolve, reject) {
            information.deployed().then(function (informationInstance) {
                informationInstance.getCommentedNews.call().then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },

    _getNewsInfo: function (id) {
        return new Promise(function (resolve,reject) {
            information.deployed().then(function (informationInstance) {
                informationInstance.getNewsInfo.call(id).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: "+err);
                });
            });
        });
    },
    /**
     * 获取资讯总长度
     * @returns {Promise<any>}
     * @private
     */
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
    }
}

/**
 * 点击事件监听器，监听list节点的点击事件
 */
document.querySelector('#myNewsList').addEventListener('click', handleClick);

function handleClick(e) {
    const target = e.target;//鼠标点击的目标
    if (target.tagName.toLowerCase() !== 'a') return;//筛选目标里面的a
    console.log(target.innerHTML);
    App.getNewsByType(target.innerHTML);
}

function keyWordSearch() {
    var keyword = document.getElementById("myNewsSearchBtn").value;
    App.getNewsByKeyword(keyword);
}

//所需单据绑定回车键
$('#myNewsSearchBtn').bind('keydown',function(event){
    if(event.keyCode == "13")
    {
        keyWordSearch();
    }
});

$(function () {
    // ##### note #####
    App.init();
    // ##### note #####

    // 激活导航
    $("#mynews-menu").addClass("menu-item-active");
});
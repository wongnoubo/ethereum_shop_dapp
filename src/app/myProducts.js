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
        });
    },

    ////////////////////////////////////////////////////////////////////////////////
   getProductsByType: async function(type){
        var publishedResult = await App._getPublishedProducts();
        var purchasedResult = await App._getPurchasedProducts();
        var result = publishedResult.concat(purchasedResult);
        publishedResult = null;
        purchasedResult = null;
        var tempNum = result.length;
        var resultList = new Array();
        var start = 0;
        for(var i = start;i<tempNum;i++){
            var resultInfo = await App._getProductInfo(result[i]);
            if(resultInfo[2]==type){
                resultList.push(result[i]);
            }
        }
        window.productList = resultList;
        window.totalNum = resultList.length;
        $("#pagination").pagination(totalNum, {
            callback: App.pageCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },

    getProductByKeyword: async function(keyword){
    var publishedResult = await App._getPublishedProducts();
    var purchasedResult = await App._getPurchasedProducts();
    var result = publishedResult.concat(purchasedResult);
    publishedResult = null;
    purchasedResult = null;
    var tempNum = result.length;
    var resultList = new Array();
    var start = 0;
    for(var i = start;i<tempNum;i++){
        var resultInfo = await App._getProductInfo(result[i]);
        if(resultInfo[1].match(keyword)==null){
        }else {
            resultList.push(result[i]);
        }
    }
    window.productList = resultList;
    window.totalNum = resultList.length;
    if(totalNum==0){
        alert("没有找到该商品信息，请您换个搜索关键词( ˶‾᷄࿀‾᷅˵ )");
    }
    $("#pagination").pagination(totalNum, {
        callback: App.pageCallback,
        prev_text: '<<<',
        next_text: '>>>',
        ellipse_text: '...',
        current_page: 0, // 当前选中的页面
        items_per_page: 8, // 每页显示的条目数
        num_display_entries: 4, // 连续分页主体部分显示的分页条目数
        num_edge_entries: 1 // 两侧显示的首尾分页的条目数
    });
    },

    getPurchasedProducts: async function () {
        var result = await App._getPurchasedProducts();
        window.productList = result;
        window.totalNum = result.length;
        $("#pagination").pagination(totalNum, {
            callback: App.pageCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },

    getPublishedProducts: async function () {
        var result = await App._getPublishedProducts();
        window.productList = result;
        window.totalNum = result.length;
        $("#pagination").pagination(totalNum, {
            callback: App.pageCallback,
            prev_text: '<<<',
            next_text: '>>>',
            ellipse_text: '...',
            current_page: 0, // 当前选中的页面
            items_per_page: 8, // 每页显示的条目数
            num_display_entries: 4, // 连续分页主体部分显示的分页条目数
            num_edge_entries: 1 // 两侧显示的首尾分页的条目数
        });
    },

    pageCallback: async function (index, jq) {
        $("#bg").hide();
        $("#products").html('');
        var pageNum = 8;
        var start = index * pageNum; // 开始
        var end = Math.min((index + 1) * pageNum, totalNum); // 结束
        var content = '';
        for (var i = start; i < end; i++) {
            var result = await App._getProductInfo(productList[i]);
            content += '<div class="col-sm-6 col-md-3" >'
                + '<div class="thumbnail">'
                + '<a href="product.html?id=' + productList[i] + '">'
                + '<div style="position: relative;">'
                + '<img id="cover" class="img-cover" src="' + result[9] + '" alt="商品封面"/>'
                + '<figcaption id="name" class="img-caption">' + result[1] + '</figcaption>'
                + '</div>'
                + '</a>'
                + '<div class="caption">'
                + '<table class="dashed_tbl">'
                + '<tr>'
                + '<td>销量: <samp id="sales">' + result[6] + '</samp></td>'
                + '<td>评分: <samp id="score">' + result[7] + '</samp></td>'
                + '</tr>'
                + '</table>'
                + '<span class="label label-info">类型</span>'
                + '<samp id="style">' + result[2] + '</samp>'
                + '<br/>'
                + '<span class="label label-info">简介</span>'
                + '<samp id="intro">' + result[3].substr(0, 20) + '......</samp>'
                + '<br/>'
                + '<span class="label label-info">玩法</span>'
                + '<samp id="rules">' + result[4].substr(0, 20) + '......</samp>'
                + '<div align="center">'
                + '<button class="btn btn-danger btn-xs" onclick="App.start(' + productList[i] + ')">获取商品</button>'
                + '<button data-toggle="modal" data-target="#modal" onclick="App.set(' + productList[i] + ')">'
                + '<span class="glyphicon glyphicon-thumbs-up"></span>'
                + '</button>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>';
        }
        $("#products").append(content);
    },

    start: async function (id) {
        var result = await App._getProductFile(id);
        alert('查看商品: ' + result);
        window.location.href = result;
    },

    set: async function (id) {

        window.evaluateId = id;
        window.evaluateScore = 10;
        var result = await App._isEvaluated(id);
        if (result) {
            // 已评价
            $("#starBtn").html('已 评');
            $("#starBtn").attr("disabled", true);
            // 重置星星
            $('#star').raty({
                number: 10, // 星星上限
                targetType: 'hint', // number是数字值 hint是设置的数组值
                target: '#hint',
                targetKeep: true,
                targetText: '请选择评分',
                hints: ['C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'SSS'],
                click: function (score, evt) {
                    window.evaluateScore = score;
                }
            });
        } else {
            // 未评价
            $("#starBtn").html('确 认');
            $("#starBtn").attr("disabled", false);
            // 重置星星
            $('#star').raty({
                number: 10, // 星星上限
                targetType: 'hint', // number是数字值 hint是设置的数组值
                target: '#hint',
                targetKeep: true,
                targetText: '请选择评分',
                hints: ['C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'SSS'],
                click: function (score, evt) {
                    window.evaluateScore = score;
                }
            });
        }
    },

    evaluate: async function () {
        console.log("nimade");
        var content = $("#content").val();
        if (content == '') content = '对方很高冷,什么也没有说......';
        store.deployed().then(function (storeInstance) {
            storeInstance.evaluate(evaluateId, evaluateScore, content, {
                from: web3.eth.accounts[0],
            }).then(function (result) {
                alert("评价成功,等待写入区块!");
                $('#modal').modal('hide');
                window.location.reload();
            }).catch(function (err) {
                alert("评价失败: " + err);
                $('#modal').modal('hide');
                window.location.reload();
            });
        });
    },

    ////////////////////////////////////////////////////////////////////////////////
    
    _getPurchasedProducts: function () {
        return new Promise(function (resolve, reject) {
            store.deployed().then(function (storeInstance) {
                storeInstance.getPurchasedProducts.call().then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },

    _getPublishedProducts: function () {
        return new Promise(function (resolve, reject) {
            store.deployed().then(function (storeInstance) {
                storeInstance.getPublishedProducts.call().then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },

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

    _getProductFile: function (id) {
        return new Promise(function (resolve, reject) {
            store.deployed().then(function (storeInstance) {
                storeInstance.getProductFile.call(id).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                    window.location.reload();
                });
            });
        });
    },

    _isEvaluated: function (id) {
        return new Promise(function (resolve, reject) {
            store.deployed().then(function (storeInstance) {
                storeInstance.isEvaluated.call(id).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                    window.location.reload();
                });
            });
        });
    }
};


/**
 * 点击事件监听器，监听list节点的点击事件
 */
document.querySelector('#list').addEventListener('click', handleClick);

function handleClick(e) {
    const target = e.target;//鼠标点击的目标
    if (target.tagName.toLowerCase() !== 'a') return;//筛选目标里面的a
    App.getProductsByType(target.innerHTML);
    console.log(target.innerHTML);
}


function keyWordSearch() {
    var keyword = document.getElementById("myProduct-keyword").value;
    App.getProductByKeyword(keyword);
}

$(function () {
    // ##### note #####
    App.init();
    // ##### note #####

    // 激活导航
    $("#myProducts-menu").addClass("menu-item-active");

    // 留言限制
    var contentCnt = 200;
    $("[name^='content']").keyup(function () {
        var num = contentCnt - $(this).val().length;
        if (num > 0) {
            $(this).next('span').html('剩余' + num + '字数');
        } else {
            $(this).next('span').html('剩余 0 字数');
            var c = $(this).val().substr(0, contentCnt);
            $(this).val(c);
        }
    }).blur(function () {
        $(this).next('span').html('');
    });
});

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
            App.getNews();
        });
    },

    ///////////////////////////////////////////////////////////////////////////////////////
    getNews:async function(){
        window.gid = getNewsQueryVariable('id');

        var result = await App._getNewsInfo(gid);
        $("#newsowner").html(result[0]);
        $("#newstitle").html(result[1]);
        $("#newsstyle").html(result[2]);
        $("#newstext").html(result[3]);
        $("#newsscore").html(result[5].toString());
        $("#newsdate").html(fmtNewsDate(result[6].toString()));
        $("#newscover").attr('src', result[4]);

        var clen = await App._getNewsCommentLength(gid);
        $("#news_comments_cnt").html(clen.toString());
        var content = '';
        for (var i = 0; i < clen; i++) {
            var result = await App._getNewsCommentInfo(gid, i);
            content += '<div class="row">'
                + '<div class="col-sm-1">'
                + '<img src="images/buyer.png"/>'
                + '<samp>***' + result[0].substr(-3) + '</samp>'
                + '</div>'
                + '<div class="col-sm-11">'
                + '<p>' + fmtNewsDate(result[1].toString()) + '</p>'
                + '<p name="newsstar" data-score="' + result[2] + '"></p>'
                + '<p>' + result[3] + '</p>'
                + '</div>'
                + '</div>'
                + '<hr/>';
        }
        $("#newscomments").append(content);
    },
    //////////////////////////////////////////////////////////////////////////////////////
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

    _getNewsCommentInfo: function (gid, cid) {
        return new Promise(function (resolve, reject) {
            information.deployed().then(function (storeInstance) {
                storeInstance.getCommentInfo.call(gid, cid).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },

    _getNewsCommentLength: function (id) {
        return new Promise(function (resolve, reject) {
            information.deployed().then(function (storeInstance) {
                storeInstance.getCommentLength.call(id).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    }
};

function getNewsQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

function fmtNewsDate(timestamp) {
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

    // 设置星星
    $("[name^='newsstar']").raty({
        number: 10, // 星星上限
        readOnly: true,
        score: function () {
            return $(this).attr('data-score');
        }
    });
});



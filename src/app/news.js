var modal = document.querySelector("#modal");

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
        //$("#newstitle").html(result[1]);
        //$("#newsstyle").html(result[2]);
        $("#newstext").html(result[3]);
        //$("#newsscore").html(result[5].toString());
        $("#newsdate").html(fmtNewsDate(result[6].toString()));
        $("#newscover").attr('src', result[4]);

        $("#newspage").html('');
        var buttonContent = '';
        buttonContent+=
            '<span id="id" hidden>0</span>'
            +'<span class="name" id="newstitle">'+ result[1] +'</span>'
            +'<span class="btn-primary" id="newsstyle">'+ result[2] +'</span>'
            +   '<p class="normal">评分：<samp id="newsscore">'+result[5].toString()+'</samp></p>'
            +'<p></p>'
            +'<p></p>'
            +'<p></p>'
            +'<p class="buy" id="bottonCentent">'
            +'<button id="commentnews"  style="background-color: red" onclick="App.newsset('+gid+')">立即评价</button>'
            +'<button onclick="window.location.href=\'store/newsHome.html\'" style="background-color: #00bdef">返回主页</button>'
            +'</p>'
        $("#newspage").append(buttonContent);

        var clen = await App._getNewsCommentLength(gid);
        $("#news_comments_cnt").html(clen.toString());
        var newsInfo = await App._getNewsInfo(gid);
        var content = '';
        var userPic = '';
        for (var i = 0; i < clen; i++) {
            var result = await App._getNewsCommentInfo(gid, i);
            if(newsInfo[0] == result[0])
                userPic = "images/owner.png";
            else
                userPic = "images/buyer.png"
            content += '<div class="row">'
                + '<div class="col-sm-1">'
                + '<img src='+userPic+'>'
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
        // 设置星星
        $("[name^='newsstar']").raty({
            number: 10, // 星星上限
            readOnly: true,
            score: function () {
                return $(this).attr('data-score');
            }
        });
    },

    newsset: async function(id){
        window.evaluateNewsScore = 10;
        window.evaluateNewsId = id;
        showModal();
        // 未评价
        $("#starNewsBtn").html('确 认');
        $("#starNewsBtn").attr("disabled", false);
        // 重置星星
        $('#star').raty({
            number: 10, // 星星上限
            targetType: 'hint', // number是数字值 hint是设置的数组值
            target: '#hint',
            targetKeep: true,
            targetText: '请选择评分',
            hints: ['C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'SSS'],
            click: function (score, evt) {
                window.evaluateNewsScore = score;
            }
        });
    },

    newsevaluate: async function () {
        var content = $("#content").val();
        if (content == '') content = '对方很高冷,什么也没有说......';
        information.deployed().then(function (informationInstance) {
            informationInstance.evaluate(evaluateNewsId, evaluateNewsScore, content, {
                from: web3.eth.accounts[0],
            }).then(function (result) {
                alert("评价成功,等待写入区块!");
                hideModal();
                window.location.reload();
            }).catch(function (err) {
                alert("评价失败: " + err);
                hideModal();
                window.location.reload();
            });
        });
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
            information.deployed().then(function (informationInstance) {
                informationInstance.getCommentInfo.call(gid, cid).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },

    _getNewsCommentLength: function (id) {
        return new Promise(function (resolve, reject) {
            information.deployed().then(function (informationInstance) {
                informationInstance.getCommentLength.call(id).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误: " + err);
                });
            });
        });
    },
    /**
     * 资讯是否是本用户已经评价过的
     * @param id
     * @returns {Promise<any>}
     * @private
     */
    _isNewsEvaluated: function (id) {
        return new Promise(function (resolve, reject) {
            information.deployed().then(function (informationInstance) {
                informationInstance.isEvaluated.call(id).then(function (result) {
                    resolve(result);
                }).catch(function (err) {
                    alert("内部错误nn: " + err);
                    window.location.reload();
                });
            });
        });
    }
};

document.querySelector("#cancel").addEventListener("click", () => {
    hideModal();
});

function hideModal() {
    modal.style.display = 'none';
}

function showModal() {
    modal.style.display = 'block';
}

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

    // 留言限制
    var contentCnt = 200;
    $("[name^='newscontent']").keyup(function () {
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



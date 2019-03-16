App = {
    init: function () {
        // connect to ipfs daemon API server
        window.ipfs = window.IpfsApi('localhost', '5001');

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
            // ......
        });
    },

    ///////////////////////////////////////////////////////////////////////////////////
    publish: async function () {
        if (!$("#form").valid()) return;
        $("#tip").html('<span style="color:blue">正在发布资讯...</span>');

        // 获取数据
        var title = $("#newstitle").val();
        var style = $("#newsstyle").val();
        var text = $("#newstext").val();
        var cover = $("#newscover")[0].files[0];

        // 上传到 IPFS
        cover = 'https://gateway.ipfs.io/ipfs/' + await App._ipfsNewsadd(cover);
        $("#tip_cover").html(cover).attr('href', cover);
        // 上传到 Ethereum
        App.handleNewsPublish(title, style, text, cover);
    },

    handleNewsPublish: function (title, style, text, cover) {
        information.deployed().then(function (informationInstance) {
            informationInstance.publish(title, style, text, cover, {
                from: web3.eth.accounts[0]
            }).then(function (result) {
                alert("发布成功,等待写入区块!");
                window.location.reload();
            }).catch(function (err) {
                alert("发布失败: " + err);
                window.location.reload();
            });
        });
    },

    //////////////////////////////////////////////////////////////////////////////
    _ipfsNewsadd: function (f) {
        return new Promise(function (resolve, reject) {
            let reader = new FileReader();
            reader.onloadend = function () {
                const buffer = ipfs.Buffer.from(reader.result);
                ipfs.add(buffer, {
                    progress: (prog) => console.log(`received: ${prog}`)
                }).then((response) => {
                    console.log(response[0].hash);
                    resolve(response[0].hash);
                }).catch((err) => {
                    alert("IPFS 发生错误");
                    window.location.reload();
                });
            };
            reader.readAsArrayBuffer(f);
        });
    }
};

$(function () {
    // ##### note #####
    App.init();
    // ##### note #####

    // 激活导航
    $("#publishnews-menu").addClass("menu-item-active");

    // 文本限制
    var introCnt = 1000; // 文本字数最大限制
    $("[name^='text']").keyup(function () {
        var num = introCnt - $(this).val().length;
        if (num > 0) {
            $(this).next('span').html('剩余' + num + '字数');
        } else {
            $(this).next('span').html('剩余 0 字数');
            var c = $(this).val().substr(0, introCnt);
            $(this).val(c);
        }
    }).blur(function () {
        $(this).next('span').html('');
    });

    // 验证表单
    $("#form").validate({
        rules: {
            title: {
                required: true,
                rangelength: [1, 20]
            },
            style: {
                required: true
            },
            text: {
                required: true,
                rangelength: [1, 1000]
            },
            cover: {
                required: true
            }
        },
        messages: {
            name: {
                required: "×",
                rangelength: "字数范围[1-20]"
            },
            style: {
                required: "×"
            },
            text: {
                required: "×",
                rangelength: "字数范围[1-1000]"
            },
            cover: {
                required: "×"
            }
        },
        success: function (label) {
            label.text("√"); // 正确时候输出
        },
        errorPlacement: function (error, element) {
            // Append error within linked label
            $(element)
                .closest("form")
                .find("label[for='" + element.attr("id") + "']")
                .append(error);
        }
    });
});
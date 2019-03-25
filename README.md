# 一个基于Ethereum &amp; IPFS的去中心化交易平台和资讯平台

<a name="9f974085"></a>
## 1 总览
       本平台拥有虚拟商品发布、购买、评价、排序，资讯发布、资讯评论、资讯排序功能。基于Ethereum & IPFS实现真正的去中心化。
<a name="f7e3da68"></a>
### 1.1 商品
* 以太币兑换购物币


![index.png](https://github.com/wongnoubo/Eshop/blob/master/images/index.png)<br />
![testIndex.gif](https://github.com/wongnoubo/Eshop/blob/master/images/testIndex.gif)

* 发布商品


![deployProduct.png](https://github.com/wongnoubo/Eshop/blob/master/images/deployProduct.png)<br />
![deployProduct.gif](https://github.com/wongnoubo/Eshop/blob/master/images/deployProduct.gif)

* 购买商品（其他账号，购买商品前需要兑换代币）


![productHome.png](https://github.com/wongnoubo/Eshop/blob/master/images/productHome.png)<br />
![testPurchseProduct.gif](https://github.com/wongnoubo/Eshop/blob/master/images/testPurchseProduct.gif)

* 评价商品


![testCommentProduct.gif](https://github.com/wongnoubo/Eshop/blob/master/images/testCommentProduct.gif)

* 查看本账号发布的商品和已经购买的商品（关键字检索，类型检索）


![myProducts-type.png](https://github.com/wongnoubo/Eshop/blob/master/images/myProducts-type.png)


![myProducts-search.png](https://github.com/wongnoubo/Eshop/blob/master/images/myProducts-search.png)


![testMyProduct.gif](https://github.com/wongnoubo/Eshop/blob/master/images/testMyProduct.gif)

* 商品排序（销量榜，评分榜，价格榜，综合榜）


![productSort.png](https://github.com/wongnoubo/Eshop/blob/master/images/productSort.png)


![testProductSort.gif](https://github.com/wongnoubo/Eshop/blob/master/images/testProductSort.gif)

<a name="c5fba53f"></a>
### 1.2 资讯
* 发布资讯


![deployNews.png](https://github.com/wongnoubo/Eshop/blob/master/images/deployNews.png)


![testDeployNews.gif](https://github.com/wongnoubo/Eshop/blob/master/images/testDeployNews.gif)

* 评价资讯（作者评价，多次评价）


![testNewsComment.gif](https://github.com/wongnoubo/Eshop/blob/master/images/testNewsComment.gif)

* 资讯主页（关键字检索，类型检索）


![newsHome.png](https://github.com/wongnoubo/Eshop/blob/master/images/newsHome.png)


![testNewsHome.gif](https://github.com/wongnoubo/Eshop/blob/master/images/testNewsHome.gif)

* 我的资讯（发布的资讯和已经评价过的资讯，关键字检索，类型检索）


![myNews.png](https://github.com/wongnoubo/Eshop/blob/master/images/myNews.png)


![myNews1.png](https://github.com/wongnoubo/Eshop/blob/master/images/myNews1.png)


* 资讯排序（评分和时间榜）


![testNewsSort.gif](https://github.com/wongnoubo/Eshop/blob/master/images/testNewsSort.gif)



<a name="8bd88093"></a>
## 2 运行前准备

<a name="8e98bd52"></a>
## 2.1 安装IPFS
* 下载ipfs压缩包

$ wget https://dist.ipfs.io/go-ipfs/v0.4.13/go-ipfs_v0.4.13_linux-amd64.tar.gz
* 解压

tar -zxvf go-ipfs_v0.4.13_linux-amd64.tar.gz
* 移动文件

$cd go-ipfs<br />$ sudo mv ipfs /usr/local/bin/ipfs
* 在本地计算机建立一个IPFS节点

ipfs init
* 跨域资源共享CORS配置

$ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST", "OPTIONS"]'<br />$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'<br /><br /><br />windows配置跨域资源共享CORS<br />ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\"PUT\", \"GET\", \"POST\", \"OPTIONS\"]'<br /><br /><br />ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"*\"]'<br /><br />
* 启动ipfs服务

$ ipfs deamon

* 浏览器访问IPFS节点

http://localhost:5001/webui
* [IPFS公共网关](https://ipfs.github.io/public-gateway-checker/)


<a name="f15fc2c3"></a>
## 2.2 安装truffle框架
* sudo apt-get install nodejs
* sudo apt-get install npm
* sudo npm install -g truffle
* 安装指定版本的truffle——sudo npm install -g truffle@"指定版本"

例子：sudo  npm install -g truffle@5.0.0


<a name="b9063e78"></a>
## 2.3 安装[ganache](https://truffleframework.com/ganache)测试框架

<a name="1dfd2bcd"></a>
## 2.4 安装以太坊浏览器插件[metamask](https://chrome.google.com/webstore/category/extensions)

* 下载安装插件![downloadMetamask.png](https://github.com/wongnoubo/Eshop/blob/master/images/downloadMetamask.png)

* metamask关联truffle框架

打开metamask——>设置——>显示助记词——>复制助记词

![metamask-ci.png](https://cdn.nlark.com/yuque/0/2019/png/237720/1553528051852-bcebf7c1-55fa-4fb5-b9d8-d1b27d7e45d3.png#align=left&display=inline&height=753&name=metamask-ci.png&originHeight=753&originWidth=452&size=22224&status=done&width=452)


打开ganache——>设置——>ACCOUNTS&KEYS<br />
![ganache-ci.png](https://github.com/wongnoubo/Eshop/blob/master/images/ganache-ci.png)


![ganache.png](https://github.com/wongnoubo/Eshop/blob/master/images/ganache.png)



<a name="d0617cd1"></a>
## 3 项目目录
* build

智能合约编译后生成的json文件
* contracts

智能合约
* migrations

智能合约部署脚本
* src（项目应用层和中间层）
* test

智能合约测试脚本

<a name="733d6c7b"></a>
## 4 项目运行
* 启动IPFS

ipfs deamon
* 启动ganache

./ganache<br />windows就直接双击ganahce.exe即可。
* 编译

truffle compile
* 部署

truffle migrate
* 安装项目依赖(第一次运行项目)

npm install
* 运行

npm run dev<br />会自动打开浏览器通过localhost:3000访问



<a name="8382c147"></a>
## 5 参考资料
* [游戏交易系统](https://github.com/littleredhat1997/Egame)
* [truffle官方教程宠物商店](https://truffleframework.com/tutorials/pet-shop)


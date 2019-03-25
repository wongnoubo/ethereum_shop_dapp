pragma solidity >=0.4.22 <0.6.0;

contract Information{
    constructor() public{

    }
    struct UserNews{
        uint[] publishedNews;
        uint[] commentedNews;
    }

    struct News{
        address owner; //资讯所有者
        string title;  //资讯标题
        string style; //资讯类型
        string text;  //资讯正文
        string cover; //资讯封面

        uint date;    //资讯发布时间
        uint score; //资讯评分
        uint clen; //资讯评论数量
        mapping(uint=>Comment) comments;    // 评价列表

    }

    // 资讯评价
    struct Comment {
        address viewer; // 查看者
        uint date;      // 日期
        uint score;     // 评分
        string content; // 评论
    }

    News[] news;
    mapping(address=>UserNews) userNewsPool;
    //发布消息成功
    event publishSuccess(uint id, string title, string style, string text, string cover, uint date);
    //评价成功
    event evaluateSuccess(uint id, address addr, uint score);

    //获取已经评价的资讯名单
    function getCommentedNews() public view returns (uint[] memory){
        return userNewsPool[msg.sender].commentedNews;
    }

    //获取已经发布的资讯名单
    function getPublishedNews() public view returns (uint[] memory){
        return userNewsPool[msg.sender].publishedNews;
    }

    // 获取资讯数量
    function getNewsLength() public view returns (uint) {
        return news.length;
    }

    // 获取评价数量
    function getCommentLength(uint id) public view returns (uint) {
        return news[id].clen;
    }

    // 获取资讯信息
    function getNewsInfo(uint id) public view returns (
        address, string memory, string memory, string memory, string memory, uint, uint) {
        require(id < news.length);
        // 获取资讯
        News storage g = news[id];
        return (g.owner, g.title, g.style, g.text, g.cover,
         g.score, g.date);
    }

    // 获得评价信息
    function getCommentInfo(uint gid, uint cid) public view returns (
        address, uint, uint, string memory) {
        require(gid < news.length);
        require(cid < news[gid].clen);
        // 获取评价
        Comment storage c = news[gid].comments[cid];
        return (c.viewer, c.date, c.score, c.content);
    }

    // 是否已经评价 通过遍历实现
    function isEvaluated(uint id) public view returns (bool) {
        News storage g = news[id];
        for(uint i = 0; i < g.clen; i++)
            if(g.comments[i].viewer == msg.sender)
                return true; // 已经评价
        return false; // 尚未评价
    }

    // 发布资讯
    function publish(
        string memory title, string memory style, string memory text,string memory cover) public {
        uint id = news.length;
        // 创建合约
        News memory g = News(msg.sender, title, style, text, cover,now,0,0); // clen = 0

        // 记录发布
        news.push(g);
        userNewsPool[msg.sender].publishedNews.push(id);

        emit publishSuccess(id, title, style, text, cover, g.date);
    }

    // 评价资讯
    function evaluate(uint id, uint score, string memory content) public {
        require(id < news.length);
        // 读取合约
        News storage g = news[id];
//        require(g.owner != msg.sender && !isEvaluated(id)); // 限制条件
        //主人可以自己评价，可以多次评价
        require(0 <= score && score <= 10); // 合法条件

        // 记录评价
        g.score += score;
        g.comments[g.clen++] = Comment(msg.sender, now, score, content);
        userNewsPool[msg.sender].commentedNews.push(id);

        emit evaluateSuccess(id, msg.sender, g.score);
    }
    function () external {
        revert();
    }
}
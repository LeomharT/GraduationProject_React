var SVG_NS = 'http://www.w3.org/2000/svg';
var colorList = ['#7AF4FF', '#67D7FF', '#52B5FF', '#295BFF'];

// 自定义SVG图层 - 继承DOMOverlay
function SvgMarker(options)
{
    TMap.DOMOverlay.call(this, options);
}

SvgMarker.prototype = new TMap.DOMOverlay();

// 初始化
SvgMarker.prototype.onInit = function (options)
{
    this.options = options.options;
    this.map = options.map;
};

// 销毁时需解绑事件监听
SvgMarker.prototype.onDestroy = function ()
{
    if (this.onClick) {
        this.dom.removeEventListener(this.onClick);
    }
};

// 创建DOM元素，返回一个DOMElement，使用this.dom可以获取到这个元素
SvgMarker.prototype.createDOM = function ()
{
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.id = 'svgDom';
    svg.setAttribute('width', document.body.clientWidth);
    svg.setAttribute('height', document.body.clientHeight);
    svg.style.cssText = 'position:absolute;top:0px;left:0px;';
    var group = []; // 定义g元素数组
    var circleShape = []; // 定义circle元素数组
    var textShape = []; // 定义text元素数组
    var tMapSvgTagName = ['鼓楼区', '仓山区', '台江区', '晋安区'];
    // 遍历传入参数，创建同等数量的svg下元素节点并绑定事件
    for (var i = 0; i < this.options.length; i++) {
        var createCenter = this.map.projectToContainer(this.options[i].position);
        group[i] = document.createElementNS(SVG_NS, 'g');

        // 在中心创建一个圆形
        circleShape[i] = document.createElementNS(SVG_NS, 'circle');
        circleShape[i].setAttribute('style', 'fill: #1890ff;stroke:#FFFFFF;opacity:0.9;');
        circleShape[i].setAttribute('cx', createCenter.x);
        circleShape[i].setAttribute('cy', createCenter.y);
        circleShape[i].setAttribute('r', 35);
        group[i].appendChild(circleShape[i]);

        // 绘制文字
        textShape[i] = document.createElementNS(SVG_NS, 'text');
        textShape[i].setAttribute('x', createCenter.x);
        textShape[i].setAttribute('y', createCenter.y + 5); // +5是为了让文字向下偏移5像素，使文字居中
        textShape[i].setAttribute('text-anchor', 'middle');
        textShape[i].setAttribute('fill', '#FFFFFF');
        textShape[i].setAttribute('cursor', 'pointer');
        textShape[i].innerHTML = tMapSvgTagName[i];
        svg.appendChild(group[i]);
        group[i].appendChild(textShape[i]);
        this.onMouseEnter = function (e)
        {
            // DOMOverlay继承自EventEmitter，可以使用emit触发事件
            // 动态修改circle颜色，所以选择传入circle节点
            this.emit('mouseenter', e.target.firstChild, e.target.childNodes[1].innerHTML);
        }.bind(this);
        this.onMouseLeave = function (e)
        {
            this.emit('mouseleave', e.target.firstChild, e.target.childNodes[1].innerHTML);
        }.bind(this);
        group[i].addEventListener('mouseenter', this.onMouseEnter);
        group[i].addEventListener('mouseleave', this.onMouseLeave);
    }
    return svg;
};

// 更新DOM元素，在地图移动/缩放后执行
SvgMarker.prototype.updateDOM = function ()
{
    if (!this.map) {
        return;
    }

    // 经纬度坐标转容器像素坐标
    for (var j = 0; j < this.options.length; j++) {
        var pixel = this.map.projectToContainer(this.options[j].position);
        var updateCenter = this.map.projectToContainer(this.options[j].position);
        this.dom.children[j]
            .getElementsByTagName('circle')[0]
            .setAttribute('cx', updateCenter.x);
        this.dom.children[j]
            .getElementsByTagName('circle')[0]
            .setAttribute('cy', updateCenter.y);
        this.dom.children[j]
            .getElementsByTagName('text')[0]
            .setAttribute('x', updateCenter.x);
        this.dom.children[j]
            .getElementsByTagName('text')[0]
            .setAttribute('y', updateCenter.y + 5);
    }
};

window.SvgMarker = SvgMarker;

var wrapper = document.getElementById("wrapper"); //获取最外层容器
var squareWidth = 50; //定义小方块的宽度以及高度
var rows = 10; //定义一行中小方块的个数
var cols = 10; //定义一列中小方块的个数
var squareSet = []; //定义小方块的集合
var linkedSquareArr = []; //定义相连方块数组
var total = 0; //定义总分数
var num = 0; //累加分
var targetScore = 3000; //目标分
var flag = true;
var enter = null; //方块下落之后再次出发mouseenter事件
// 检测是否相连
function checkLinked(current, temp) {
	if (current == null) {
		return;
	}
	// 检测左侧的方块是否是同一种颜色的
	if (
		current.col > 0 &&
		squareSet[current.row][current.col - 1] &&
		squareSet[current.row][current.col - 1].value == current.value &&
		temp.indexOf(squareSet[current.row][current.col - 1]) == -1
	) {
		temp.push(squareSet[current.row][current.col - 1]);
		checkLinked(squareSet[current.row][current.col - 1], temp);
	}
	// 检测右侧的方块是否是同一种颜色的
	if (
		current.col < cols - 1 &&
		squareSet[current.row][current.col + 1] &&
		squareSet[current.row][current.col + 1].value == current.value &&
		temp.indexOf(squareSet[current.row][current.col + 1]) == -1
	) {
		temp.push(squareSet[current.row][current.col + 1]);
		checkLinked(squareSet[current.row][current.col + 1], temp);
	}
	// 检测上侧的方块是否是同一种颜色的
	if (
		current.row > 0 &&
		squareSet[current.row - 1][current.col] &&
		squareSet[current.row - 1][current.col].value == current.value &&
		temp.indexOf(squareSet[current.row - 1][current.col]) == -1
	) {
		temp.push(squareSet[current.row - 1][current.col]);
		checkLinked(squareSet[current.row - 1][current.col], temp);
	}
	// 检测下侧的方块是否是同一种颜色的
	if (
		current.row < rows - 1 &&
		squareSet[current.row + 1][current.col] &&
		squareSet[current.row + 1][current.col].value == current.value &&
		temp.indexOf(squareSet[current.row + 1][current.col]) == -1
	) {
		temp.push(squareSet[current.row + 1][current.col]);
		checkLinked(squareSet[current.row + 1][current.col], temp);
	}
}
// 创建小方块
function createSquare(i, j, value) {
	var square = document.createElement("div");
	square.style.width = squareWidth + "px";
	square.style.height = squareWidth + "px";
	square.style.position = "absolute";
	square.style.backgroundSize = "cover";
	square.style.transform = "scale(0.95)";
	square.style.boxSizing = "border-box";
	square.style.borderRadius = "12px";
	square.value = value;
	square.row = i;
	square.col = j;
	square.style.backgroundImage = "url('images/" + value + ".png')";
	return square;
}
// 让小方块闪烁
function blink(linkedSquareArr) {
	for (var i = 0; i < linkedSquareArr.length; i++) {
		if (linkedSquareArr[i] == null) {
			return;
		}
		linkedSquareArr[i].className = "blink";
	}
	displayScore();
}
// 还原小方块样式
function reduction() {
	for (var i = 0; i < linkedSquareArr.length; i++) {
		linkedSquareArr[i].className = "";
	}
}
// 显示小方块的分数
function displayScore() {
	var radix = 5; //初始分数
	var score = document.getElementById("score");
	num = 0;
	if (linkedSquareArr.length == 0) {
		return;
	}
	for (var i = 0; i < linkedSquareArr.length; i++) {
		num += radix + i * 10;
	}
	score.innerHTML = i + "块" + num + "分";
	score.style.transition = "none";
	score.style.opacity = 1;
	setTimeout(function () {
		score.style.transition = "opacity 1s";
		score.style.opacity = 0;
	}, 1000);
}
// 当鼠标移入小方块时，把小方块添加到linkedSquareArr数组中
function mouseenter(obj) {
	// 防止在消除小方块时，浏览器监听不到鼠标再次移入事件
	if (!flag) {
		enter = obj;
		return;
	}
	reduction();
	linkedSquareArr = [];
	linkedSquareArr.push(obj);
	checkLinked(obj, linkedSquareArr);
	if (linkedSquareArr.length < 2) {
		linkedSquareArr = [];
	}
	blink(linkedSquareArr);
}
// 删除小方块
function popStar() {
	for (let i = 0; i < linkedSquareArr.length; i++) {
		setTimeout(function () {
			if (linkedSquareArr[i] == null) {
				return;
			}
			squareSet[linkedSquareArr[i].row][linkedSquareArr[i].col] = null;
			linkedSquareArr[i].remove();
		}, i * 15);
	}
	total += num;
	document.getElementById("currentScore").innerHTML = "当前分数：" + total;
}
// 为小方块绑定事件
function bindEvent(i, j) {
	squareSet[i][j].onmouseenter = function () {
		mouseenter(this);
	};
	squareSet[i][j].onclick = function () {
		click();
	};
}
// 当鼠标点击时的处理函数
function click() {
	if (linkedSquareArr.length < 2 || !flag) {
		return;
	}
	flag = false;
	popStar();
	setTimeout(function () {
		move();
		setTimeout(function () {
			if (!isOver()) {
				if (total < targetScore) {
					alert("游戏挑战失败");
				} else {
					alert("恭喜，挑战成功");
				}
			} else {
				linkedSquareArr = [];
				flag = true;
				mouseenter(enter);
			}
		}, 300);
	}, 120 * linkedSquareArr.length);
}
// 当一行中或一列中没有小方块时则左移或者下移
function move() {
	for (var i = 0; i < rows; i++) {
		var t = 0;
		for (var j = 0; j < cols; j++) {
			if (squareSet[j][i] == null) {
				continue;
			}
			if (j != t) {
				squareSet[t][i] = squareSet[j][i];
				squareSet[t][i].row = t;
				squareSet[j][i] = null;
			}
			t++;
		}
	}
	for (var i = 0; i < squareSet[0].length; ) {
		if (squareSet[0][i] == null) {
			for (var j = 0; j < rows; j++) {
				squareSet[j].splice(i, 1);
			}
			continue;
		}
		i++;
	}
	refresh();
}
// 刷新页面
function refresh() {
	for (var i = 0; i < squareSet.length; i++) {
		for (var j = 0; j < squareSet[i].length; j++) {
			if (squareSet[i][j] == null) {
				continue;
			}
			squareSet[i][j].col = j;
			squareSet[i][j].style.transition = "all 0.2s";
			squareSet[i][j].style.left = squareWidth * squareSet[i][j].col + "px";
			squareSet[i][j].style.bottom = squareWidth * squareSet[i][j].row + "px";
		}
	}
}
// 判断是否游戏结束
function isOver() {
	var temp = [];
	for (var i = 0; i < squareSet.length; i++) {
		for (var j = 0; j < squareSet[i].length; j++) {
			checkLinked(squareSet[i][j], temp);
		}
	}
	if (temp.length < 2) {
		return false;
	} else {
		return true;
	}
}
// 初始化小方块
function init() {
	for (var i = 0; i < rows; i++) {
		squareSet[i] = [];
		for (var j = 0; j < cols; j++) {
			squareSet[i].push(createSquare(i, j, parseInt(Math.random() * 5)));
			bindEvent(i, j);
			wrapper.appendChild(squareSet[i][j]);
		}
	}
	refresh();
}
init();

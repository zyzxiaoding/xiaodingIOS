//左滑删除等事件
function fntouch(pwidth) {
    var initX, initY; //记录初始的位置
    var moveX, moveY; //记录移动后的位置
    var pX, pY; //记录移动中的位置
    var sildeWidth //按钮移动的距离
    var istouchStart = false; //判断是否已经开始触摸
    var ismoveStart = false; //判断你是否已经开始滑动
    var isClick = true; //判断是否可以点击
    var ySilde = true,
        xSilde = true; //默认都能左右滑动
    var isButtonClick = false; //判断是否点击到了滑出的按钮
    if (!pwidth) {
        sildeWidth = 1.78;
    } else {
        sildeWidth = pwidth;
    }
    window.addEventListener('touchstart', touchStart, false);
    //开始触摸
    function touchStart(e) {
        //取父亲节点
        var obj = $api.closest(e.target, ".swiper-li");
        var del_elem = $api.closest(e.target, ".btn");
        var elem = e.target;
        var mainLi = document.querySelectorAll(".swiper-li");
        //选中了相应的节点
        if (obj) {
            if (del_elem) {
                isButtonClick = true;
                isClick = true;
                // e.preventDefault();
                e.stopPropagation()
            } else {
                istouchStart = true;
                //  console.log('开始')
                initX = event.targetTouches[0].pageX;
                initY = event.targetTouches[0].pageY;
                if (ismoveStart) {
                    for (var i = 0; i < mainLi.length; i++) {
                        mainLi[i].style.transition = "transform 0.2s"; //延缓动画效果
                        mainLi[i].style.transform = "stranslateX(0rem)";
                        mainLi[i].style.WebkitTition = "transform 0.2s"; //延缓动画效果
                        mainLi[i].style.WebkitTransform = "translateX(0rem)";
                    }
                    // e.preventDefault();
                    ismoveStart = false;
                }
                obj.addEventListener('touchmove', touchMove, false);
            }
            obj.addEventListener('touchend', touchEnd, false);
        } else {
            for (var i = 0; i < mainLi.length; i++) {
                mainLi[i].style.transition = "transform 0.2s"; //延缓动画效果
                mainLi[i].style.transform = "stranslateX(0rem)";
                mainLi[i].style.WebkitTition = "transform 0.2s"; //延缓动画效果
                mainLi[i].style.WebkitTransform = "translateX(0rem)";
            }
            e.preventDefault();
            ismoveStart = false;
            // console.log('aaaa'+isClick)
        }
        // console.log(e.targetTouches[0].clientX + '   '+e.targetTouches[0].clientY)
    }

    //开始滑动
    function touchMove(e) {
        var obj = $api.closest(e.target, ".swiper-li");
        if (!isClick) return;
        //选中了滑动块
        if (obj) {
            moveX = event.targetTouches[0].pageX; //获取移动后的最终X值
            moveY = event.targetTouches[0].pageY; //获取移动后的最终Y值
            pX = (moveX - initX) / 1; //变化中的X值;
            pY = (moveY - initY) / 1; //变化中的Y值;
            if (xSilde) {
                  console.log(1111111)
                if (pX > 0) {
                  console.log(44444)
                    if (!ismoveStart) {
                        obj.style.WebkitTransform = "translateX(0rem)"; //实现滑动效果，删除按钮出现
                        obj.style.transform = "translateX(0rem)"; //实现滑动效果，删除按钮出现
                    }
                } else {
                  console.log(5555)
                    if (!ismoveStart) {
                        var l = Math.abs(pX); //取绝对值X
                        if (l > sildeWidth) {
                            l = sildeWidth;
                        }
                        // console.log(l)
                        obj.style.WebkitTransform = "translateX(" + -l + "rem)"; //实现滑动效果，删除按钮出现
                        obj.style.transform = "translateX(" + -l + "rem)"; //实现滑动效果，删除按钮出现
                    }
                }
                //判断X值如果大于15 ， 区分左右滑动还是上下滑动
                if (Math.abs(pX) >= 15) {
                    console.log(33333333)
                    ySilde = false; //禁止上下滑动
                    //yThink = false;//禁止上下滑动
                    e.preventDefault(); //禁止上下滑动
                }else{
                  ySilde = true;
                }
            }
            if (ySilde) {
                console.log(22222)
                //上下滑动的时候禁止左右滑动
                if (Math.abs(pY) >= 35) {
                    obj.style.WebkitTransform = "translateX(0rem)";
                    e.preventDefault();
                    xSilde = false;
                }else{
                  xSilde = true;
                }
            }
        }
    }

    //结束触摸
    function touchEnd(e) {
        var obj = $api.closest(e.target, ".swiper-li");
        xSilde = true;
        ySilde = true;
        var objX, objY;
        if (obj) {
            objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/rem\)/g, "")) * 1;
            if (!ismoveStart) {
                if (objX < 0 && Math.abs(objX) > 1) {
                    // console.log(1)
                    obj.style.WebkitTransform = "translateX(" + -sildeWidth + "rem)";
                    obj.style.transform = "translateX(" + -sildeWidth + "rem)";
                    ismoveStart = true;
                    //滑动的时候禁止点击
                    isClick = false;
                } else {
                    obj.style.WebkitTransform = "translateX(0rem)";
                    obj.style.transform = "translateX(0rem)";
                    ismoveStart = false;
                    if (!isClick) {
                        // console.log(2);
                        e.preventDefault();
                        isClick = true;
                    }
                }
            } else if (isButtonClick) {
                setTimeout(function() {
                    obj.style.WebkitTransform = "translateX(0rem)";
                    obj.style.transform = "translateX(0rem)";
                }, 500)
                isButtonClick = false;
            }
        }
        istouchStart = false;
    }
}

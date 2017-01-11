var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)*0.9;
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)*0.9;
var canvas;
var ctx;
var topspeed = 6;
var ANIMSPEED = 25;
var czysc = 3;
var bckcolor = "#ffffff";
var WIDTH = w;
var HEIGHT = h;
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
var accel = new Vektor(0, 0.08);
var target = new Vektor((w/2)+50, (h/2)-100);
var b1 = new Ball(new Vektor(20, h-20), new Vektor(15, -15), new Vektor(0.01, 0.03), topspeed);
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

function Vektor(x, y) {
    this.x = x;
    this.y = y;
    this.add = function (v) {
        this.x += v.x;
        this.y += v.y;
    }
    this.multiply = function(n){
        this.x*=n;
        this.y*=n;
    }
    this.substract = function(v){
        this.x -= v.x;
        this.y -= v.y;
    }
    this.copySubstract = function (x,y){
        this.x=x.x-y.x;
        this.y=x.y-y.y;
    }
    /**
     *
     * @returns {number|*}
     */
    this.length = function () {
        var tmpl;
        tmpl = Math.sqrt((this.x * this.x + this.y * this.y));
        return tmpl;
    }
    this.limit = function(l){
        if(this.length()>l) {
            this.normalize();
            this.multiply(l);
        }
    }
    this.normalize = function () {
        var tmpl = this.length();
        if(tmpl>0){
            this.x /=tmpl;
            this.y /=tmpl;
        }
    }
    this.copy = function(){
        var copy=new Vektor(this.x,this.y);
        return copy;
    }
}
function Ball(startp, startv, saccel, stopspeed) {
    this.color= "#557755";
    this.poz = startp;
    this.vel = startv;
    this.accel = saccel;
    this.topspeed = stopspeed;
    this.maxForce = 0.2;
    this.lumen = 1;
    this.move = function () {
        this.vel.add(this.accel);
        if(this.vel.length()>this.topspeed){

        }
        this.poz.add(this.vel);

    }
    this.seek = function(target){
        var desired=new Vektor(0,0);
        desired.copySubstract(target,this.poz);
        desired.multiply(this.topspeed);
        var steer=new Vektor(0,0);
        steer.copySubstract(desired,this.vel);
        steer.limit(this.maxForce);
        this.accel.add(steer);
        if(this.vel.length()>this.topspeed){
            this.vel.limit(this.topspeed);
        }
        this.lumen=this.vel.length()*0.1;
        this.vel.add(this.accel);
        this.poz.add(this.vel);
        this.accel.multiply(0);
    }
    this.colission = function () {
        if (this.poz.x + 10 > WIDTH || this.poz.x - 10 < 0) {
            this.vel.x = this.vel.x * (-1);
        }
        if (this.poz.y + 10 > HEIGHT || this.poz.y - 10 < 0) {
            this.vel.y = this.vel.y * (-1);
        }
    }
    this.draw = function () {
        ctx.fillStyle = ColorLuminance(this.color, Number(this.lumen));
        circle(this.poz.x, this.poz.y, 10);

    }
}
function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
}
function clear() {
    ctx.fillStyle = bckcolor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}
function draw() {
    if (czysc == 1) {
        clear();
    }
    ctx.fillStyle = "#ff0000";
    circle(target.x, target.y, 10);
    b1.colission();
    b1.draw();
    //b1.move();
    b1.seek(target);
}
function rnd(from, to)
{
    return Math.floor(Math.random() * (to - from + 1) + from);
}
function ColorLuminance(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
}
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
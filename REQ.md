基于当前的项目，我想实现一个resize image功能，之前的功能bulk resize images保持不动，新独立功能与之并存。
resize image实现对单张图片的resize处理，完全在用户浏览器处理，不需要上传到服务器，界面上可以参考https://www.adobe.com/express/feature/image/resize, 具体需求如下：

1. 用户选择一张图片，上传组件直接用image-uploader组件，选择图片后进入resize页面
2. resize页面左边显示选择的图片，图片上显示选中框，用户点击尺寸选中框随着调整，选择Custom尺寸时，可以自由拖拽调整，自由拖拽调整且宽高锁定打开时，输入框中数值同步更新；图片下方一个Zoom slider，用户可以调整图片的缩放比例，缩放比例显示在slider右边上方
 选中图片进入resize页面默认选中Custom和图片实际尺寸，选中框默认选中整个图片尺寸

3. resize页面右边，提供下拉框可以选择Aspect ratio，支持各种社交平台或标准、自定义尺寸如下：
Instagram：Story 9:16（1080 x 1920），Square 1:1 （1080 x 1080），Portrait 4:5 （1080 x 1350），Landscape 1.91:1 （1080 x 566）
Youtube： Thumbnail 16:9 （1280 x 720），Landscape 16:9 （1920 x 1080），Shorts 9:16 （1080 x 1920）
Facebook： Post 1.91:1 （1200 x 628），Feed Landscape 16:9 （1280 x 720），Feed Portrait 9:16（720 x 1280），Story 9:16 （720 x 1280）
LinkedIn：Blog Post 1.91:1 （1200 x 628），Post 1:1 （1920 x 1920），Landscape 16:9 （1920 x 1080），Vertical 9:16（1080 x 1920）
Snapchat：Story 9:16 （1080 x 1920），Standard 9:16 （1080 x 1920）
X/Twitter： Post 16:9 （1200 x 670），Landscape 16:9 （1280 x 720），Portrait 9:16 （720 x 1280），Square 1:1 （1200 x 1200）
Pinterest：Pin 2:3 （735 x 1102），Standard Pins 2:3 （1080 x 1620）， Pin Square 1:1（1080 x 1080），Pin Vertical 9:16 （1080 x 1920）
另外支持标准比例和自定义：
Standard：Widescreen 16:9， iPhone 9:16，Presentation Slide 4:3，Square 1:1，Landscape 3:2，Portrait 2:3
Custom：两个输入框，用户输入width, height，中间一个锁定/解锁按钮，末尾下拉框选择px/pt/in/cm/mm

再提供一个图片格式选择下拉框，支持jpg, png, webp

再下方显示图片文件大小，如：
Original size: 64 KB
New size: 647 KB

一个Reset按钮，点击后重置选择的图片尺寸

再下方一个下载按钮，点击后下载resize后的图片


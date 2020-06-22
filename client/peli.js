
import QrScanner from "/qr-scanner.min.js";
QrScanner.WORKER_PATH = "/qr-scanner-worker.min.js";


$.ajaxSetup({
    async: false
});

var disabled = false;
function scanned(a){
    if(disabled){
        return;
    }
    bootbox.hideAll();
    disabled = true;
    try{
    //qrScanner.stop();
        var obj = JSON.parse(a);
        var r = $.get("https://peli.pleissi19.fi/api?operation=scan&path="+obj.id);
        var resJson = r.responseJSON;
        var story = resJson.story;
        console.log(resJson);
        console.log(story);
    }
    catch(err){
        console.log(err);
        bootbox.alert({
            size: "xl",
            title: "Lukuvirhe!",
            message: "Yritä uudelleen",
            callback: function(){
                //qrScanner.start();
                disabled = false;
            }
        })
    }
    bootbox.alert({
        size: "xl",
        title: "Luettu",
        message: story,
        callback: function(){
                //qrScanner.start();
                disabled = false;
        }
    })
    for(var i=0;i<resJson.options.length;i++){
        $(".modal-footer").append("<button type=\"button\" id=\"btn"+i+"\" class=\"btn btn-primary\">"+resJson.options[i].title+"</button>")
        $("#btn"+i).click(function(){
            var thid = this.id;
            bootbox.hideAll();
            disabled = false;
            bootbox.alert({
                size: "xl",
                title: "Seuraava paikka",
                message: "Mene pisteeseen "+resJson.options[parseInt(thid.substr(3))].location,
                callback: function(){
                        $(".bootbox-close-button").css("display","block");
 
                }
            });
            $(".bootbox-close-button").css("display","block");

            })
        }
    
    
}
const qrScanner = new QrScanner($("#preview")[0], scanned);

qrScanner.start();


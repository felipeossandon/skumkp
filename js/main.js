window.onload = function() {
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var textType = /text.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
                var lista = new Array();
                var texto = reader.result.toString();
                texto = texto.replace(/(\r\n|\n|\r)/gm,"");
                lista = texto.split(",");
                var numLineas = lista.length;
                var direccion = 'http://www.sodimac.cl/sodimac-cl/browse/productJson.jsp';
                var myData;
                //var sku;
                var proxy = 'https://cors-anywhere.herokuapp.com/';
                var publicado = 0;
                var despublicado = 0;
                var noExiste = 0;
                var nFallos = 0;
                var arreglo = new Array();
                var fallos = new Array();
                for(var i=0; i<numLineas;i++){
                    $.ajax({ url: proxy+direccion,
                        data: {
                            "productId": lista[i].toString(),
                            "storeId": 69
                        },
                        success: function(myData){
                            var sku = $.parseJSON(myData);
                            arreglo.push(sku[0]);
                        },
                        error: function() {
                            nFallos++;
                            fallos.push(nFallos); }
                    });
                }
                var lineasTexto = new String();
                var stock = new String();
                $(document).ajaxStop(function () {
                    // 0 === $.active
                    for(var i = 0; i<arreglo.length;i++){
                        if(arreglo[i].status != "Not OK"){
                            if(arreglo[i].published){
                                publicado++;
                                stock = arreglo[i].stockLevel;
                                stock = stock.substring(stock.lastIndexOf("=")+1,stock.lastIndexOf("}"));
                                lineasTexto = lineasTexto + arreglo[i].productId +"," + stock +",Publicado \n";
                            }else{
                                despublicado++;
                                lineasTexto = lineasTexto + arreglo[i].productId + ",No Aplica,Despublicado \n";
                            }
                        }else{
                            noExiste++;
                            lineasTexto = lineasTexto + arreglo[i].productId + ",No Existe \n";
                        }
                    }
                    resumenSku.innerText = "Publicados: "+publicado+"\n Despublicados: "+despublicado + "\n No Existe: " + noExiste + "\n Con Falla en la llamada: " + nFallos
                    fileDisplayArea.innerText = lineasTexto;
                });
            }

            reader.readAsText(file);
        } else {
            fileDisplayArea.innerText = "Archivo No Soportado!"
        }
    });
}


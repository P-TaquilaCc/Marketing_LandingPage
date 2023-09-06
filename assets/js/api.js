$(document).ready(function () {
  //EndPoint para listar las categorias de negocios
  fetch("http://127.0.0.1:8000/api/listcategorias")
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        $.each(data, function (i, item) {
          /* Se muestra la lista de las categorías en el combo box */
          $("#id_store_type").append(
            $("<option>", {
              value: item.id,
              text: item.nombre,
            })
          );
        });
      } else {
        console.log(data.message);
      }
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
    });

  $(function () {
    $(".opcion").click(function () {
      if ($(this).val() === "0") {
        $("#RUC").removeAttr("disabled");
        $("#razonSocial").removeAttr("disabled");
      } else {
        $("#RUC").attr("disabled", "disabled");
        $("#razonSocial").attr("disabled", "disabled");
      }
    });
  });

  /* Verifica si se hizo clic en el botón enviar para registrar el Negocio */
  $("#enviar").submit(function (e) {
    e.preventDefault();
    let f = $(this);
    let data = new FormData(document.getElementById("enviar"));
    data.append("dato", "valor");

    /* Variables de los inputs */
    let radioEmpresa = $("#radio-empresa").prop("checked");
    let radioEmprendedor = $("#radio-emprendedor").prop("checked");
    let RUC = $("#RUC").val();
    let razonSocial = $("#razonSocial").val();
    let DNI = $("#DNI").val();
    let representanteLegal = $("#representanteLegal").val();
    let nombre = $("#nombre").val();
    let correo = $("#correo").val();
    let telefono = $("#telefono").val();
    let idCategoria = $("#id_store_type").val();
    let direccion = $("#direccion").val();
    let hora_inicio = $("#hora_inicio").val();
    let hora_fin = $("#hora_fin").val();
    let latitud = $("#latitud").val();
    let longitud = $("#longitud").val();
    let image = $("#image").val();

    /*Comprobar el tipo de negocio*/
    if (radioEmpresa != false) {
      /* Comprobar si los inputs estan vacios*/
      if (
        RUC != "" &&
        razonSocial != "" &&
        DNI != "" &&
        representanteLegal != "" &&
        nombre != "" &&
        correo != "" &&
        telefono != "" &&
        idCategoria != null &&
        direccion != "" &&
        hora_inicio != "" &&
        hora_fin != "" &&
        latitud != "" &&
        longitud != "" &&
        image != ""
      ) {
        /* Se utiliza el endpoint para guardar el NEGOCIO en la BD */
        fetch("http://127.0.0.1:8000/api/sendNegocios", {
          headers: { Accept: "application/json" },
          method: "POST",
          body: data,
        })
          .then(function (res) {
            if (res.ok) {
              Swal.fire("Exitoso!", "Registro con éxito", "success");
              $("#enviar").trigger("reset");
              $("#RUC").removeAttr("disabled");
              $("#razonSocial").removeAttr("disabled");
            } else {
              res.json().then(function (data) {
                Swal.fire({
                  icon: "error",
                  title: "Error!",
                  text: data.error,
                });
              });
            }
          })
          .catch(function (res) {
            alertify.error("Error al registrar este negocio");
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "Cuidado!",
          text: "Complete todos los campos",
        });
      }
    } else if (radioEmprendedor != false) {
      if (
        DNI != "" &&
        representanteLegal != "" &&
        nombre != "" &&
        correo != "" &&
        telefono != "" &&
        idCategoria != null &&
        direccion != "" &&
        hora_inicio != "" &&
        hora_fin != "" &&
        latitud != "" &&
        longitud != "" &&
        image != ""
      ) {
        /* Se utiliza el endpoint para guardar el NEGOCIO en la BD */
        fetch("http://127.0.0.1:8000/api/sendNegocios", {
          headers: { Accept: "application/json" },
          method: "POST",
          body: data,
        })
          .then(function (res) {
            if (res.ok) {
              Swal.fire("Exitoso!", "Registro con éxito", "success");
              $("#enviar").trigger("reset");
              $("#RUC").removeAttr("disabled");
              $("#razonSocial").removeAttr("disabled");
            } else {
              res.json().then(function (data) {
                Swal.fire({
                  icon: "error",
                  title: "Error!",
                  text: data.error,
                });
              });
            }
          })
          .catch(function (res) {
            alertify.error("Error al registrar este negocio");
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "Cuidado!",
          text: "Complete todos los campos",
        });
      }
    }
  });

  //EndPoint para listar las imagenes de los negocios
  fetch("http://127.0.0.1:8000/api/listNegocios")
    .then((response) => response.json())
    .then((data) => {
      const slider = new Swiper(".clients-slider", {
        speed: 400,
        loop: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
        },
        slidesPerView: "auto",
        pagination: {
          el: ".swiper-pagination",
          type: "bullets",
          clickable: true,
        },
        breakpoints: {
          320: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 60,
          },
          640: {
            slidesPerView: 4,
            spaceBetween: 80,
          },
          992: {
            slidesPerView: 6,
            spaceBetween: 120,
          },
        },
      });

      data.negocios.forEach((negocio) => {
        const imgElement = document.createElement("img");
        imgElement.src = negocio.imagenUrl;

        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        slide.appendChild(imgElement);

        slider.appendSlide(slide);
      });
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
    });
});

//Obtener coordenadas de Google Maps
var vMarker;
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: new google.maps.LatLng(-18.007701, -70.247001),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });

  vMarker = new google.maps.Marker({
    position: new google.maps.LatLng(-18.007701, -70.247001),
    draggable: true,
  });

  google.maps.event.addListener(vMarker, "dragend", function (evt) {
    $("#txtlatitud").val(evt.latLng.lat().toFixed(6));
    $("#txtlongitud").val(evt.latLng.lng().toFixed(6));

    map.panTo(evt.latLng);
  });

  map.setCenter(vMarker.position);
  vMarker.setMap(map);
}

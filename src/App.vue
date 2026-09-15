<template>
  <q-layout view="hHh lpR fFf">
    <!-- ===== ENCABEZADO PROFESIONAL ===== -->
    <q-header elevated class="header-pro text-white">
      <q-toolbar class="q-py-sm header-toolbar">
        <q-avatar size="48px" class="logo-pro q-mr-md">
          <q-icon name="build" size="26px" />
          <span class="logo-pro-punto"></span>
        </q-avatar>
        <q-separator vertical dark class="header-sep q-mr-md gt-xs" />
        <div>
          <div class="text-h5 text-weight-medium titulo-pro">
            Servicio Técnico <span class="text-weight-bold">Don Efraín</span>
          </div>
          <div class="text-caption header-subtitulo">
            <q-icon name="phone_iphone" size="12px" class="q-mr-xs" />
            Gestión de equipos en reparación
          </div>
        </div>
        <q-space />
        <q-btn
          unelevated
          no-caps
          color="white"
          text-color="teal-10"
          icon="add_circle"
          label="Nuevo servicio"
          size="md"
          @click="abrirNuevoServicio()"
          class="btn-nuevo gt-xs q-px-lg"
        >
          <q-tooltip>Registrar nuevo servicio</q-tooltip>
        </q-btn>
        <q-btn
          round
          unelevated
          color="white"
          text-color="teal-10"
          icon="add"
          size="md"
          @click="abrirNuevoServicio()"
          class="xs q-ml-sm"
        >
          <q-tooltip>Registrar nuevo servicio</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="bg-gradient-light q-py-lg">
        <div class="q-px-lg full-width">
          <!-- ===== RESUMEN RÁPIDO MEJORADO ===== -->
          <div class="row q-col-gutter-lg q-mb-xl">
            <!-- Tarjeta Total de Servicios -->
            <div class="col-12 col-sm-6 col-md-3 animar-entrada">
              <q-card
                flat
                class="card-resumen bg-teal-1 text-teal-9 shadow-hover"
              >
                <q-card-section class="q-pt-lg">
                  <div class="text-center">
                    <q-avatar class="icono-resumen" size="56px">
                      <q-icon name="folder_open" size="28px" />
                    </q-avatar>
                    <div class="text-h4 text-weight-bold q-mt-md">
                      {{ servicios.length }}
                    </div>
                    <div class="text-subtitle2">Total de Servicios</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Tarjeta Sin Entregar -->
            <div class="col-12 col-sm-6 col-md-3 animar-entrada">
              <q-card
                flat
                class="card-resumen bg-orange-1 text-orange-9 shadow-hover"
              >
                <q-card-section class="q-pt-lg">
                  <div class="text-center">
                    <q-avatar class="icono-resumen" size="56px">
                      <q-icon name="schedule" size="28px" />
                    </q-avatar>
                    <div class="text-h4 text-weight-bold q-mt-md">
                      {{ contarSinEntregar() }}
                    </div>
                    <div class="text-subtitle2">Sin Entregar</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Tarjeta Pagos Pendientes -->
            <div class="col-12 col-sm-6 col-md-3 animar-entrada">
              <q-card
                flat
                class="card-resumen bg-red-1 text-red-9 shadow-hover"
              >
                <q-card-section class="q-pt-lg">
                  <div class="text-center">
                    <q-avatar class="icono-resumen" size="56px">
                      <q-icon name="warning" size="28px" />
                    </q-avatar>
                    <div class="text-h4 text-weight-bold q-mt-md">
                      {{ contarPagoPendiente() }}
                    </div>
                    <div class="text-subtitle2">Pagos Pendientes</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Tarjeta Recaudado -->
            <div class="col-12 col-sm-6 col-md-3 animar-entrada">
              <q-card
                flat
                class="card-resumen bg-green-1 text-green-9 shadow-hover"
              >
                <q-card-section class="q-pt-lg">
                  <div class="text-center">
                    <q-avatar class="icono-resumen" size="56px">
                      <q-icon name="trending_up" size="28px" />
                    </q-avatar>
                    <div class="text-h4 text-weight-bold q-mt-md">
                      ${{ formatearDinero(totalRecaudado()) }}
                    </div>
                    <div class="text-subtitle2">Recaudado</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- ===== BUSCADOR Y FILTRO MEJORADO ===== -->
          <div class="q-mb-xl">
            <q-card flat class="shadow-1">
            <q-card-section class="q-pa-lg">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-8">
                    <q-input
                      v-model="busqueda"
                      dense
                      outlined
                      clearable
                      label="🔍 Buscar cliente o equipo"
                      class="search-input"
                    >
                      <template v-slot:prepend>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-4">
                    <q-select
                      v-model="filtroEstado"
                      dense
                      outlined
                      label="📊 Filtrar por estado"
                      :options="[
                        'Todos',
                        'Recibido',
                        'En reparación',
                        'Listo para entregar',
                        'Entregado',
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- ===== MENSAJE CUANDO NO HAY NADA ===== -->
          <q-card
            v-if="servicios.length === 0"
            flat
            class="q-pa-xl text-center text-grey-7 shadow-1"
          >
            <q-icon name="inbox" size="64px" class="q-mb-md text-grey-5" />
            <div class="text-h6 text-weight-medium">
              Todavía no hay servicios registrados
            </div>
            <div class="text-subtitle2 q-mt-sm">
              Toque el botón + para registrar el primer equipo
            </div>
          </q-card>

          <!-- ===== TARJETAS DE SERVICIOS MEJORADAS ===== -->
          <div class="row q-col-gutter-lg q-mb-xl">
            <div
              v-for="s in servicios"
              :key="s.id"
              class="col-12 col-sm-6 col-lg-4 animar-entrada"
              v-show="seMuestra(s)"
            >
              <q-card
                flat
                class="card-servicio shadow-hover full-height"
                :class="colorTarjeta(s)"
              >
                <!-- Encabezado de la Tarjeta -->
                <q-card-section class="q-pb-sm">
                  <div class="row items-start no-wrap q-gutter-sm">
                    <q-icon
                      :name="iconoEquipo(s.estadoEquipo)"
                      :color="colorEstadoEquipo(s.estadoEquipo)"
                      size="32px"
                    />
                    <div class="col">
                      <div
                        class="text-h6 text-weight-bold"
                        style="line-height: 1.2"
                      >
                        {{ marcaFinal(s) }} {{ s.modelo }}
                      </div>
                      <div class="text-caption text-grey-7">
                        {{ s.cliente }}
                      </div>
                      <div v-if="s.telefono" class="text-caption text-grey-6">
                        {{ s.telefono }}
                      </div>
                    </div>
                    <q-badge
                      :color="colorEstadoEquipo(s.estadoEquipo)"
                      :label="s.estadoEquipo"
                      class="text-weight-bold"
                    />
                  </div>
                </q-card-section>

                <q-separator class="q-my-none" />

                <!-- Información Principal -->
                <q-card-section class="q-py-md">
                  <div class="row q-col-gutter-md">
                    <div class="col-6">
                      <div class="text-caption text-grey-8 text-weight-bold">
                        REPARACIÓN(ES)
                      </div>
                      <div class="text-body2">{{ reparacionesTexto(s) }}</div>
                    </div>
                    <div class="col-6">
                      <div class="text-caption text-grey-8 text-weight-bold">
                        TÉCNICO
                      </div>
                      <div class="text-body2">{{ s.tecnico }}</div>
                    </div>
                  </div>

                  <div class="row q-col-gutter-md q-mt-sm">
                    <div class="col-6">
                      <div class="text-caption text-grey-8 text-weight-bold">
                        FECHA
                      </div>
                      <div class="text-body2">
                        {{ formatearFecha(s.fecha) }}
                      </div>
                    </div>
                    <div class="col-6">
                      <div
                        v-if="s.hora"
                        class="text-caption text-grey-8 text-weight-bold"
                      >
                        HORA
                      </div>
                      <div v-if="s.hora" class="text-body2">{{ s.hora }}</div>
                    </div>
                  </div>

                  <!-- Precio destacado -->
                  <q-separator class="q-my-md" />
                  <div class="text-center q-py-sm bg-grey-1 rounded-borders precio-destacado">
                    <div class="text-caption text-grey-8 text-weight-bold">
                      PRECIO
                    </div>
                    <div class="text-h5 text-weight-bold text-teal-8">
                      ${{ formatearDinero(s.precio) }}
                    </div>
                    <div class="text-caption text-grey-7">
                      {{ s.metodoPago }}
                    </div>
                  </div>
                </q-card-section>

                <q-separator />

                <!-- Estado del Pago -->
                <q-card-section class="q-py-md">
                  <div
                    class="text-caption text-grey-8 text-weight-bold q-mb-sm"
                  >
                    ESTADO DE PAGO
                  </div>
                  <div class="row q-col-gutter-sm items-center">
                    <div class="col-auto">
                      <q-chip
                        v-if="s.estadoPago === 'Pagado'"
                        dense
                        color="green-8"
                        text-color="white"
                        icon="check_circle"
                        label="✓ Pagado"
                      />
                      <q-chip
                        v-else-if="s.estadoPago === 'Pendiente'"
                        dense
                        color="red-7"
                        text-color="white"
                        icon="warning"
                        label="⚠ Pendiente"
                      />
                      <q-chip
                        v-else-if="s.estadoPago === 'Abono'"
                        dense
                        color="orange-8"
                        text-color="white"
                        icon="savings"
                        :label="'Abonó $' + formatearDinero(s.abono)"
                      />
                    </div>
                  </div>
                  <div
                    v-if="s.estadoPago === 'Abono'"
                    class="text-caption text-orange-9 q-mt-xs"
                  >
                    ↳ Falta: ${{ formatearDinero(s.precio - s.abono) }}
                  </div>
                </q-card-section>

                <!-- Alerta si está listo -->
                <q-banner
                  v-if="s.estadoEquipo === 'Listo para entregar'"
                  dense
                  class="bg-blue-2 text-blue-10 rounded-borders q-mx-md q-mb-md"
                >
                  <q-icon name="notifications_active" class="q-mr-xs" />
                  <strong>Avisar cliente: equipo listo</strong>
                </q-banner>

                <!-- Calificación y Observaciones -->
                <q-card-section
                  v-if="
                    s.estadoEquipo === 'Entregado' ||
                    s.calificacion > 0 ||
                    s.observaciones
                  "
                  class="q-pt-none"
                >
                  <div v-if="s.calificacion > 0" class="q-mb-sm">
                    <div
                      class="text-caption text-grey-8 text-weight-bold q-mb-xs"
                    >
                      CALIFICACIÓN
                    </div>
                    <q-rating
                      :model-value="s.calificacion"
                      :max="5"
                      size="1.2em"
                      color="orange-8"
                      icon="star_border"
                      icon-selected="star"
                      readonly
                    />
                  </div>
                  <div
                    v-if="s.observaciones"
                    class="text-caption bg-grey-2 q-pa-sm rounded-borders"
                  >
                    <strong>Notas:</strong> {{ s.observaciones }}
                  </div>
                </q-card-section>

                <q-separator />

                <!-- Botones de Acción -->
                <q-card-actions vertical class="q-pa-md">
                  <template v-if="s.estadoEquipo !== 'Entregado'">
                    <q-btn
                      outline
                      no-caps
                      color="teal-8"
                      icon="edit"
                      label="Editar"
                      @click="editarServicio(s)"
                      class="full-width"
                    />
                    <q-btn
                      outline
                      no-caps
                      color="negative"
                      icon="delete"
                      label="Eliminar"
                      @click="confirmarEliminar(s.id)"
                      class="full-width"
                    />
                  </template>
                  <div
                    v-if="s.estadoEquipo === 'Entregado'"
                    class="text-caption text-grey-6 text-center"
                  >
                    <q-icon name="lock" size="14px" />
                    Equipo entregado: registro bloqueado
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>

        <!-- ===== MODAL DEL FORMULARIO ===== -->
        <q-dialog v-model="mostrarModal" persistent>
          <q-card style="width: 520px; max-width: 95vw">
            <q-card-section class="bg-teal-8 text-white row items-center">
              <q-icon
                :name="idEditando === null ? 'add_circle' : 'edit'"
                size="24px"
                class="q-mr-sm"
              />
              <div class="text-h6">
                <span v-if="idEditando === null">Nuevo servicio</span>
                <span v-else>Editar servicio</span>
              </div>
              <q-space />
              <q-btn flat round dense icon="close" @click="cerrarModal()" />
            </q-card-section>

            <q-form @submit="guardarServicio()">
              <q-card-section
                style="max-height: 62vh"
                class="scroll q-gutter-y-sm"
              >
                <q-input
                  v-model="servicio.cliente"
                  label="Nombre del cliente *"
                  outlined
                  dense
                  lazy-rules
                  @update:model-value="limpiarNombreCliente()"
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) ||
                      'Escriba el nombre del cliente',
                    (val) => val.trim().length >= 3 || 'Mínimo 3 caracteres',
                    (val) =>
                      !/\d/.test(val || '') ||
                      'El nombre no puede contener números',
                  ]"
                />

                <q-input
                  v-model="servicio.telefono"
                  label="Teléfono de contacto"
                  outlined
                  dense
                  mask="### ### ####"
                  hint="Opcional, para avisar cuando esté listo"
                />

                <q-select
                  v-model="servicio.marca"
                  label="Marca del equipo *"
                  outlined
                  dense
                  :options="marcas"
                  class="select-marca"
                  :rules="[(val) => !!val || 'Seleccione la marca']"
                />

                <q-input
                  v-if="servicio.marca === 'Otra'"
                  v-model="servicio.marcaOtra"
                  label="¿Cuál marca? *"
                  outlined
                  dense
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) || 'Escriba la marca',
                    (val) => val.trim().length >= 2 || 'Mínimo 2 caracteres',
                  ]"
                />

                <q-input
                  v-model="servicio.modelo"
                  label="Modelo del equipo *"
                  outlined
                  dense
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) || 'Indique el modelo',
                  ]"
                />

                <q-select
                  v-model="servicio.reparacion"
                  label="Tipo(s) de reparación *"
                  outlined
                  dense
                  multiple
                  emit-value
                  map-options
                  use-chips
                  @update:model-value="alCambiarReparaciones()"
                  :options="[
                    'Cambio de pantalla',
                    'Cambio de batería',
                    'Cambio de pin de carga',
                    'Liberación',
                    'Mantenimiento de software',
                    'Cambio de flex',
                    'Otros',
                  ]"
                  :rules="[
                    (val) =>
                      (Array.isArray(val) && val.length > 0) ||
                      'Seleccione al menos una reparación',
                  ]"
                />

                <q-input
                  v-if="
                    Array.isArray(servicio.reparacion) &&
                    servicio.reparacion.includes('Otros')
                  "
                  v-model="servicio.reparacionOtra"
                  label="¿Cuál(es) reparación(es)? *"
                  outlined
                  dense
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) ||
                      'Describa la reparación',
                  ]"
                />

                <q-select
                  v-model="servicio.tecnico"
                  label="Técnico que atendió *"
                  outlined
                  dense
                  :options="['Don Efraín', 'Carlos Ruiz', 'Laura Gómez']"
                  :rules="[(val) => !!val || 'Seleccione el técnico']"
                />

                <div class="row q-col-gutter-sm">
                  <div class="col-6">
                    <q-input
                      v-model="servicio.fecha"
                      label="Fecha de recepción (automática) *"
                      outlined
                      dense
                      readonly
                      :rules="[(val) => !!val || 'Elija la fecha']"
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      v-model="servicio.hora"
                      label="Hora de recepción (automática) *"
                      outlined
                      dense
                      readonly
                      :rules="[(val) => !!val || 'Elija la hora']"
                    />
                  </div>
                </div>

                <q-input
                  :model-value="formatearDinero(servicio.precio)"
                  @update:model-value="alEscribirPrecio($event, 'precio')"
                  label="Precio cobrado *"
                  outlined
                  dense
                  prefix="$"
                  lazy-rules
                  :rules="[
                    (val) => numeroDe(val) !== null || 'Escriba el precio',
                    (val) =>
                      numeroDe(val) > 0 || 'El precio debe ser mayor a $0',
                    (val) =>
                      numeroDe(val) <= 5000000 ||
                      'Verifique el precio, parece muy alto',
                  ]"
                />

                <q-select
                  v-model="servicio.metodoPago"
                  label="Método de pago *"
                  outlined
                  dense
                  :options="['Efectivo', 'Transferencia', 'Tarjeta']"
                  :rules="[(val) => !!val || 'Seleccione el método de pago']"
                />

                <q-select
                  v-model="servicio.estadoPago"
                  label="Estado del pago *"
                  outlined
                  dense
                  :options="['Pagado', 'Pendiente', 'Abono']"
                  :rules="[(val) => !!val || 'Seleccione el estado del pago']"
                  @update:model-value="alCambiarEstadoPago()"
                />

                <q-input
                  v-if="servicio.estadoPago === 'Abono'"
                  :model-value="formatearDinero(servicio.abono)"
                  @update:model-value="alEscribirPrecio($event, 'abono')"
                  label="Valor del abono *"
                  outlined
                  dense
                  prefix="$"
                  lazy-rules
                  :rules="[
                    (val) =>
                      numeroDe(val) !== null || 'Escriba el valor del abono',
                    (val) =>
                      numeroDe(val) > 0 || 'El abono debe ser mayor a $0',
                    (val) =>
                      numeroDe(val) < servicio.precio ||
                      'El abono debe ser menor al precio total',
                  ]"
                />

                <q-select
                  v-model="servicio.estadoEquipo"
                  label="Estado del equipo *"
                  outlined
                  dense
                  :options="estadosDisponibles"
                  :rules="[(val) => !!val || 'Seleccione el estado del equipo']"
                  @update:model-value="alCambiarEstadoEquipo()"
                />

                <q-input
                  v-model="servicio.observaciones"
                  label="Observaciones"
                  type="textarea"
                  outlined
                  dense
                  autogrow
                  counter
                  maxlength="200"
                  hint="Opcional: daños visibles, accesorios, peticiones del cliente"
                />
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn
                  flat
                  label="Cancelar"
                  color="grey-8"
                  @click="cerrarModal()"
                />
                <q-btn
                  unelevated
                  type="submit"
                  color="teal-8"
                  icon="save"
                  label="Guardar"
                />
              </q-card-actions>
            </q-form>
          </q-card>
        </q-dialog>

        <!-- ===== CONFIRMACIÓN DE BORRADO ===== -->
        <q-dialog v-model="mostrarConfirmacionEliminar">
          <q-card style="width: 380px; max-width: 90vw">
            <q-card-section class="row items-center">
              <q-avatar
                icon="delete_forever"
                color="negative"
                text-color="white"
              />
              <div class="q-ml-md">
                <div class="text-subtitle1 text-weight-bold">
                  ¿Eliminar este servicio?
                </div>
                <div class="text-caption text-grey-8">
                  Esta acción no se puede deshacer.
                </div>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                flat
                label="Cancelar"
                color="grey-8"
                @click="mostrarConfirmacionEliminar = false"
              />
              <q-btn
                unelevated
                label="Sí, eliminar"
                color="negative"
                @click="eliminarServicio()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- ===== CALIFICACIÓN CUANDO EL EQUIPO SE ENTREGA ===== -->
        <q-dialog v-model="mostrarCalificacion" persistent>
          <q-card style="width: 380px; max-width: 90vw">
            <q-card-section class="bg-teal-8 text-white row items-center">
              <q-icon name="reviews" size="24px" class="q-mr-sm" />
              <div class="text-h6">Califique el servicio</div>
            </q-card-section>
            <q-card-section class="text-center">
              <div class="text-subtitle1 q-mb-sm">
                ¿Cómo evalúa el cliente el servicio?
              </div>
              <q-rating
                v-model="calificacionTemporal"
                :max="5"
                size="3em"
                color="orange"
                icon="star_border"
                icon-selected="star"
              />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                flat
                label="Omitir"
                color="grey-8"
                @click="guardarCalificacion(false)"
              />
              <q-btn
                unelevated
                label="Guardar"
                color="teal-8"
                icon="check"
                @click="guardarCalificacion(true)"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useLocalStorage } from "@vueuse/core";

/* ===== NOTIFICACIONES ===== */
const $q = useQuasar();

/* ===== DATOS PERSISTENTES ===== */
const servicios = useLocalStorage("servicios", []);

/* ===== ESTADO DE LA INTERFAZ ===== */
const mostrarModal = ref(false);
const mostrarReloj = ref(false);
const mostrarConfirmacionEliminar = ref(false);
const idEditando = ref(null);
const idEliminar = ref(null);
const busqueda = ref("");
const filtroEstado = ref("Todos");

/* ===== MARCAS ===== */
const marcas = [
  "Samsung",
  "Apple",
  "Redmi",
  "Huawei",
  "Motorola",
  "Nokia",
  "Alcatel",
  "ZTE",
  "Oppo",
  "Realme",
  "Sony",
  "Otra",
];

/* ===== FORMULARIO ===== */
const servicio = ref(nuevoServicioVacio());
const mostrarCalificacion = ref(false);
const calificacionTemporal = ref(0);
let estadoEquipoAnterior = "Recibido";

const TODOS_LOS_ESTADOS = [
  "Recibido",
  "En reparación",
  "Listo para entregar",
  "Entregado",
];

/* Un registro nuevo no puede entregarse de una vez: solo después de editarlo */
const estadosDisponibles = computed(() =>
  idEditando.value === null
    ? TODOS_LOS_ESTADOS.filter((e) => e !== "Entregado")
    : TODOS_LOS_ESTADOS
);

function nuevoServicioVacio() {
  return {
    cliente: "",
    telefono: "",
    marca: "",
    marcaOtra: "",
    modelo: "",
    reparacion: [],
    reparacionOtra: "",
    tecnico: "",
    fecha: "",
    hora: "",
    precio: null,
    metodoPago: "",
    estadoPago: "",
    abono: null,
    estadoEquipo: "Recibido",
    calificacion: 0,
    observaciones: "",
  };
}

/* ===== ABRIR / CERRAR MODAL ===== */
function abrirNuevoServicio() {
  servicio.value = nuevoServicioVacio();
  servicio.value.fecha = fechaDeHoy();
  servicio.value.hora = horaActual();
  idEditando.value = null;
  estadoEquipoAnterior = servicio.value.estadoEquipo;
  mostrarModal.value = true;
}

function cerrarModal() {
  mostrarModal.value = false;
  idEditando.value = null;
  servicio.value = nuevoServicioVacio();
}

/* ===== CRUD ===== */
function guardarServicio() {
  // No se puede entregar si el pago no está completo
  if (
    servicio.value.estadoEquipo === "Entregado" &&
    servicio.value.estadoPago !== "Pagado"
  ) {
    $q.notify({
      type: "negative",
      message:
        "No se puede entregar el equipo: el pago no está completo (solo con estado 'Pagado').",
    });
    servicio.value.estadoEquipo = estadoEquipoAnterior;
    return;
  }
  if (idEditando.value === null) {
    servicios.value.push({ ...servicio.value, id: Date.now() });
  } else {
    const indice = servicios.value.findIndex((s) => s.id === idEditando.value);
    servicios.value[indice] = { ...servicio.value, id: idEditando.value };
  }
  cerrarModal();
}

function editarServicio(servicioGuardado) {
  const copia = { ...servicioGuardado };
  // Compatibilidad con registros antiguos: reparación única -> lista
  copia.reparacion = Array.isArray(copia.reparacion)
    ? copia.reparacion
    : copia.reparacion
    ? [copia.reparacion]
    : [];
  if (copia.reparacionOtra === undefined) {
    copia.reparacionOtra = "";
  }
  servicio.value = copia;
  idEditando.value = servicioGuardado.id;
  estadoEquipoAnterior = servicio.value.estadoEquipo;
  mostrarModal.value = true;
}

function confirmarEliminar(id) {
  const registro = servicios.value.find((s) => s.id === id);
  if (registro && registro.estadoEquipo === "Entregado") {
    $q.notify({
      type: "warning",
      message: "No se puede eliminar un servicio ya entregado (historial).",
    });
    return;
  }
  idEliminar.value = id;
  mostrarConfirmacionEliminar.value = true;
}

function eliminarServicio() {
  servicios.value = servicios.value.filter((s) => s.id !== idEliminar.value);
  idEliminar.value = null;
  mostrarConfirmacionEliminar.value = false;
}

/* ===== REGLAS DEPENDIENTES ===== */
/* El nombre del cliente no admite números: se eliminan al escribir */
function limpiarNombreCliente() {
  const limpio = (servicio.value.cliente || "").replace(/[0-9]/g, "");
  if (limpio !== servicio.value.cliente) {
    servicio.value.cliente = limpio;
  }
}

function alCambiarEstadoPago() {
  if (servicio.value.estadoPago !== "Abono") {
    servicio.value.abono = null;
  }
}

/* Al quitar "Otros" de las reparaciones, se limpia el texto libre */
function alCambiarReparaciones() {
  const lista = servicio.value.reparacion;
  if (!Array.isArray(lista) || !lista.includes("Otros")) {
    servicio.value.reparacionOtra = "";
  }
}

function alCambiarEstadoEquipo() {
  // No permitir entregar si el pago está pendiente o solo abonado
  if (
    servicio.value.estadoEquipo === "Entregado" &&
    servicio.value.estadoPago !== "Pagado"
  ) {
    servicio.value.estadoEquipo = estadoEquipoAnterior;
    $q.notify({
      type: "warning",
      message:
        "El pago no está completo. Pase el estado a 'Pagado' antes de entregar.",
    });
    return;
  }
  if (servicio.value.estadoEquipo === "Entregado") {
    calificacionTemporal.value = servicio.value.calificacion || 0;
    mostrarCalificacion.value = true;
  } else {
    servicio.value.calificacion = 0;
  }
  estadoEquipoAnterior = servicio.value.estadoEquipo;
}

function guardarCalificacion(conNota) {
  servicio.value.calificacion = conNota ? calificacionTemporal.value : 0;
  mostrarCalificacion.value = false;
}

/* ===== BUSCADOR Y FILTRO (sin computed) ===== */
function seMuestra(s) {
  const texto = (busqueda.value || "").toLowerCase().trim();
  const marcaModelo = (marcaFinal(s) + " " + s.modelo).toLowerCase();
  const coincideTexto =
    texto === "" ||
    s.cliente.toLowerCase().includes(texto) ||
    marcaModelo.includes(texto);

  const coincideEstado =
    filtroEstado.value === "Todos" || s.estadoEquipo === filtroEstado.value;

  return coincideTexto && coincideEstado;
}

function reparacionesTexto(s) {
  const lista = Array.isArray(s.reparacion)
    ? s.reparacion
    : s.reparacion
    ? [s.reparacion]
    : [];
  if (lista.length === 0) {
    return "Sin reparación";
  }
  return lista
    .map((r) => (r === "Otros" && s.reparacionOtra ? s.reparacionOtra : r))
    .join(", ");
}

function marcaFinal(s) {
  if (s.marca === "Otra" && s.marcaOtra) {
    return s.marcaOtra;
  }
  return s.marca;
}

/* ===== INDICADORES ===== */
function contarSinEntregar() {
  let total = 0;
  servicios.value.forEach((s) => {
    if (s.estadoEquipo !== "Entregado") {
      total = total + 1;
    }
  });
  return total;
}

function contarPagoPendiente() {
  let total = 0;
  servicios.value.forEach((s) => {
    if (s.estadoPago === "Pendiente" || s.estadoPago === "Abono") {
      total = total + 1;
    }
  });
  return total;
}

function totalRecaudado() {
  let total = 0;
  servicios.value.forEach((s) => {
    if (s.estadoPago === "Pagado") {
      total = total + Number(s.precio || 0);
    } else if (s.estadoPago === "Abono") {
      total = total + Number(s.abono || 0);
    }
  });
  return total;
}

/* ===== APOYO VISUAL ===== */
function colorTarjeta(s) {
  if (s.estadoPago === "Pendiente") {
    return "bg-red-1 borde-pendiente";
  }
  if (s.estadoPago === "Abono") {
    return "bg-orange-1 borde-abono";
  }
  if (s.estadoEquipo === "Entregado") {
    return "bg-white borde-entregado";
  }
  return "bg-green-1 borde-pagado";
}

function iconoEquipo(estado) {
  if (estado === "Recibido") return "inventory_2";
  if (estado === "En reparación") return "build_circle";
  if (estado === "Listo para entregar") return "task_alt";
  return "local_shipping";
}

function colorEstadoEquipo(estado) {
  if (estado === "Recibido") return "blue-grey-6";
  if (estado === "En reparación") return "amber-8";
  if (estado === "Listo para entregar") return "blue-7";
  return "green-7";
}

/* ===== FECHAS ===== */
const formatoMoneda = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

/* Formatea dinero con separadores de miles: 1250000 -> 1.250.000 */
function formatearDinero(valor) {
  const numero = Number(valor);
  if (valor === null || valor === undefined || valor === "" || isNaN(numero)) {
    return String(valor ?? "");
  }
  return formatoMoneda.format(numero);
}

/* Convierte texto con separadores (1.250.000) a número: 1250000 */
function numeroDe(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  const n = Number(String(valor).replace(/[^\d]/g, ""));
  return isNaN(n) ? null : n;
}

/* Al escribir en los campos de dinero se guarda el número limpio;
   la vista lo muestra formateado con separadores de miles */
function alEscribirPrecio(valor, campo) {
  servicio.value[campo] = numeroDe(valor);
}
function fechaDeHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function horaActual() {
  const ahora = new Date();
  const horas = String(ahora.getHours()).padStart(2, "0");
  const minutos = String(ahora.getMinutes()).padStart(2, "0");
  return `${horas}:${minutos}`;
}

function formatearFecha(fecha) {
  if (!fecha) {
    return "Sin fecha";
  }
  const partes = fecha.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
</script>

<style>
/* ===== TIPOGRAFÍA PREMIUM ===== */
body,
.q-app,
.q-layout {
  font-family: "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI",
    Roboto, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Fondo claro uniforme: elimina franjas oscuras del body */
body {
  background: #f2f9f7 !important;
  color-scheme: light;
}

#app {
  background: #f2f9f7;
  min-height: 100vh;
}

::selection {
  background: rgba(0, 191, 165, 0.25);
}

/* ===== SCROLLBAR GLOBAL ELEGANTE ===== */
body::-webkit-scrollbar {
  width: 10px;
}

body::-webkit-scrollbar-thumb {
  background: rgba(11, 79, 69, 0.3);
  border-radius: 8px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

body::-webkit-scrollbar-thumb:hover {
  background: rgba(11, 79, 69, 0.5);
  background-clip: padding-box;
  border: 2px solid transparent;
}

/* ===== INPUTS REFINADOS ===== */
.q-field .q-field__control {
  border-radius: 12px;
  transition: box-shadow 0.25s ease, background 0.25s ease;
}

.q-field--outlined .q-field__control {
  background: rgba(255, 255, 255, 0.85);
}

.q-field--outlined .q-field__control:before {
  border: 1.5px solid rgba(0, 0, 0, 0.14);
  transition: border-color 0.25s ease;
}

.q-field--outlined:hover .q-field__control:before {
  border-color: rgba(0, 105, 92, 0.5);
}

.q-field--focused .q-field__control {
  box-shadow: 0 0 0 4px rgba(0, 191, 165, 0.12);
  background: #ffffff;
}

.q-field__label {
  font-weight: 500;
}

/* ===== BOTONES REFINADOS ===== */
.q-btn {
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.q-btn--rectangle.q-btn--outline {
  transition: all 0.22s ease;
}

.q-btn--rectangle.q-btn--outline:hover {
  transform: translateY(-1px);
}

.q-btn--round {
  border-radius: 50%;
}

/* ===== TARJETAS Y CONTENEDORES ===== */
.q-card {
  border-radius: 18px;
}

.q-dialog .q-card {
  border-radius: 20px !important;
  box-shadow: 0 24px 60px rgba(3, 40, 34, 0.28),
    0 4px 16px rgba(3, 40, 34, 0.12) !important;
  overflow: hidden;
}

.q-dialog__backdrop {
  background: rgba(0, 0, 0, 0.28) !important;
}

/* ===== CHIPS Y BADGES ===== */
.q-chip {
  border-radius: 999px;
  font-weight: 600;
}

.q-badge {
  font-weight: 600;
  letter-spacing: 0.3px;
  border-radius: 8px;
}

/* ===== SELECTS Y MENÚS ===== */
.q-menu {
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 6px;
}

.q-menu .q-item {
  border-radius: 9px;
  min-height: 38px;
  transition: background 0.15s ease;
}

.q-menu .q-item.q-item--active,
.q-menu .q-item[aria-active="true"] {
  background: rgba(0, 191, 165, 0.12);
  color: #0b4f45;
  font-weight: 600;
}

/* Evita que el scroll del menú de opciones arrastre al modal de atrás */
.q-menu {
  overscroll-behavior: contain;
}

/* Menú de marcas: compacto y con barra de scroll delgada */
.q-menu {
  max-height: 240px;
}

.q-menu::-webkit-scrollbar,
.q-menu ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.q-menu::-webkit-scrollbar-thumb,
.q-menu ::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.22);
  border-radius: 6px;
}

.q-menu::-webkit-scrollbar-track,
.q-menu ::-webkit-scrollbar-track {
  background: transparent;
}

/* ===== ANIMACIÓN DE ENTRADA DE TARJETAS ===== */
@keyframes aparecer {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animar-entrada {
  animation: aparecer 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
</style>

<style scoped>
/* ===== ENCABEZADO PROFESIONAL ===== */
.header-pro {
  background: linear-gradient(100deg, #062e29 0%, #0b4f45 45%, #116a5c 100%);
  box-shadow: 0 3px 18px rgba(3, 40, 34, 0.45) !important;
  border-bottom: 1px solid rgba(0, 191, 165, 0.55);
  position: relative;
}

/* Línea de acento luminosa en la base */
.header-pro::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    #00bfa5 0%,
    #4ddfc0 30%,
    rgba(0, 191, 165, 0.25) 70%,
    transparent 100%
  );
}

.header-toolbar {
  min-height: 76px;
}

.logo-pro {
  background: linear-gradient(135deg, #00bfa5 0%, #26a69a 100%);
  box-shadow: 0 4px 12px rgba(0, 191, 165, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  position: relative;
  flex-shrink: 0;
}

.logo-pro-punto {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #ffca28;
  border: 2px solid #0b4f45;
}

.header-sep {
  height: 40px;
  opacity: 0.35;
}

.titulo-pro {
  letter-spacing: 0.3px;
  line-height: 1.2;
}

.titulo-pro span {
  color: #4ddfc0;
}

.header-subtitulo {
  opacity: 0.75;
  letter-spacing: 0.4px;
  display: flex;
  align-items: center;
}

.btn-nuevo {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: all 0.25s ease;
}

.btn-nuevo:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
}

.bg-gradient-light {
  background:
    radial-gradient(1100px 480px at 8% -4%, rgba(0, 191, 165, 0.08), transparent 60%),
    radial-gradient(1000px 500px at 100% 0%, rgba(38, 166, 154, 0.07), transparent 55%),
    linear-gradient(180deg, #f2f9f7 0%, #f7fafc 45%, #eef3f8 100%);
  min-height: 100vh;
}

/* ===== TARJETAS RESUMEN ===== */
.card-resumen {
  border-radius: 18px;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.9);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(15, 60, 55, 0.07);
}

/* Barra de acento superior según el color de fondo de cada tarjeta */
.card-resumen::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: currentColor;
  opacity: 0.85;
}

/* Brillo diagonal decorativo */
.card-resumen::after {
  content: "";
  position: absolute;
  top: -60%;
  right: -25%;
  width: 55%;
  height: 160%;
  background: linear-gradient(
    115deg,
    transparent 40%,
    rgba(255, 255, 255, 0.55) 50%,
    transparent 60%
  );
  transform: rotate(0.01deg);
  pointer-events: none;
}

.card-resumen:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 36px rgba(10, 60, 52, 0.14),
    0 4px 12px rgba(10, 60, 52, 0.08) !important;
}

.icono-resumen {
  border-radius: 50%;
  background: currentColor;
  color: inherit;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.icono-resumen .q-icon {
  color: #ffffff;
}

.card-resumen:hover .icono-resumen {
  transform: scale(1.08) rotate(-4deg);
}

/* ===== TARJETAS DE SERVICIO ===== */
.card-servicio {
  border-radius: 18px;
  overflow: hidden;
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s ease, border-color 0.28s ease;
  border: 1px solid rgba(0, 0, 0, 0.07);
}

.card-servicio:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 191, 165, 0.55);
  box-shadow: 0 18px 38px rgba(0, 60, 50, 0.15),
    0 4px 12px rgba(0, 60, 50, 0.07) !important;
}

.precio-destacado {
  border-radius: 14px;
  border: 1px solid rgba(0, 105, 92, 0.16);
  background: linear-gradient(160deg, #f4fbf9 0%, #ecf5f2 100%) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.shadow-hover {
  box-shadow: 0 2px 8px rgba(15, 60, 55, 0.08);
  transition: box-shadow 0.3s ease;
}

.shadow-1 {
  box-shadow: 0 2px 10px rgba(15, 60, 55, 0.07);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
}

/* ===== BÚSQUEDA ===== */
.search-input {
  transition: all 0.3s ease;
}

.search-input:focus-within {
  box-shadow: 0 0 0 4px rgba(0, 191, 165, 0.14);
  border-radius: 12px;
}

.search-input .q-field__control {
  min-height: 44px;
}

/* ===== BORDES LATERALES ===== */
.borde-pendiente {
  border-left: 5px solid #c62828;
}

.borde-abono {
  border-left: 5px solid #ef6c00;
}

.borde-pagado {
  border-left: 5px solid #2e7d32;
}

.borde-entregado {
  border-left: 5px solid #9e9e9e;
}

/* ===== RESPONSIVO ===== */
@media (max-width: 600px) {
  .q-px-lg {
    padding-left: 12px;
    padding-right: 12px;
  }

  .card-servicio {
    border-radius: 10px;
  }

  .card-resumen:hover {
    transform: none;
  }

  .card-servicio:hover {
    transform: none;
  }
}
</style>

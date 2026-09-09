<template>
  <q-layout view="hHh lpR fFf">
    <!-- ===== ENCABEZADO MEJORADO ===== -->
    <q-header elevated class="bg-gradient text-white">
      <q-toolbar class="q-py-md">
        <q-icon name="smartphone" size="32px" class="q-mr-sm" />
        <div>
          <div class="text-h5 text-weight-bold">
            Servicio Técnico Don Efraín
          </div>
          <div class="text-caption text-grey-3">
            Gestión de equipos en reparación
          </div>
        </div>
        <q-space />
        <q-btn
          round
          unelevated
          color="white"
          text-color="teal-9"
          icon="add_circle"
          size="lg"
          @click="abrirNuevoServicio()"
          class="q-mr-sm"
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
            <div class="col-12 col-sm-6 col-md-3">
              <q-card
                flat
                class="card-resumen bg-teal-1 text-teal-9 shadow-hover"
              >
                <q-card-section class="q-pt-lg">
                  <div class="text-center">
                    <q-icon
                      name="folder_open"
                      size="40px"
                      class="q-mb-md text-teal-8"
                    />
                    <div class="text-h4 text-weight-bold">
                      {{ servicios.length }}
                    </div>
                    <div class="text-subtitle2">Total de Servicios</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Tarjeta Sin Entregar -->
            <div class="col-12 col-sm-6 col-md-3">
              <q-card
                flat
                class="card-resumen bg-orange-1 text-orange-9 shadow-hover"
              >
                <q-card-section class="q-pt-lg">
                  <div class="text-center">
                    <q-icon
                      name="schedule"
                      size="40px"
                      class="q-mb-md text-orange-8"
                    />
                    <div class="text-h4 text-weight-bold">
                      {{ contarSinEntregar() }}
                    </div>
                    <div class="text-subtitle2">Sin Entregar</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Tarjeta Pagos Pendientes -->
            <div class="col-12 col-sm-6 col-md-3">
              <q-card
                flat
                class="card-resumen bg-red-1 text-red-9 shadow-hover"
              >
                <q-card-section class="q-pt-lg">
                  <div class="text-center">
                    <q-icon
                      name="warning"
                      size="40px"
                      class="q-mb-md text-red-8"
                    />
                    <div class="text-h4 text-weight-bold">
                      {{ contarPagoPendiente() }}
                    </div>
                    <div class="text-subtitle2">Pagos Pendientes</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Tarjeta Recaudado -->
            <div class="col-12 col-sm-6 col-md-3">
              <q-card
                flat
                class="card-resumen bg-green-1 text-green-9 shadow-hover"
              >
                <q-card-section class="q-pt-lg">
                  <div class="text-center">
                    <q-icon
                      name="trending_up"
                      size="40px"
                      class="q-mb-md text-green-8"
                    />
                    <div class="text-h4 text-weight-bold">
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
            <div class="text-h6">Todavía no hay servicios registrados</div>
            <div class="text-subtitle2 q-mt-sm">
              Toque el botón + para registrar el primer equipo
            </div>
          </q-card>

          <!-- ===== TARJETAS DE SERVICIOS MEJORADAS ===== -->
          <div class="row q-col-gutter-lg q-mb-xl">
            <div
              v-for="s in servicios"
              :key="s.id"
              class="col-12 col-sm-6 col-lg-4"
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
                  <div class="text-center q-py-sm bg-grey-1 rounded-borders">
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
                  <q-btn
                    outline
                    color="teal-8"
                    icon="edit"
                    label="Editar"
                    @click="editarServicio(s)"
                    class="full-width"
                    :disable="s.estadoEquipo === 'Entregado'"
                  />
                  <q-btn
                    outline
                    color="negative"
                    icon="delete"
                    label="Eliminar"
                    @click="confirmarEliminar(s.id)"
                    class="full-width"
                    :disable="s.estadoEquipo === 'Entregado'"
                  />
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
                  behavior="dialog"
                  menu-anchor="bottom middle"
                  menu-self="top middle"
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
                      label="Fecha de recepción *"
                      outlined
                      dense
                      mask="####-##-##"
                      :rules="[
                        (val) => !!val || 'Elija la fecha',
                        (val) =>
                          /^\d{4}-\d{2}-\d{2}$/.test(val || '') ||
                          'Formato: AAAA-MM-DD',
                      ]"
                    >
                      <template v-slot:append>
                        <q-icon
                          name="event"
                          class="cursor-pointer"
                          @click="mostrarCalendario = true"
                        />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-6">
                    <q-input
                      v-model="servicio.hora"
                      label="Hora de recepción *"
                      outlined
                      dense
                      readonly
                      :rules="[(val) => !!val || 'Elija la hora']"
                    >
                      <template v-slot:append>
                        <q-icon
                          name="access_time"
                          class="cursor-pointer"
                          @click="mostrarReloj = true"
                        />
                      </template>
                    </q-input>
                  </div>
                </div>

                <q-dialog v-model="mostrarCalendario">
                  <q-date
                    v-model="servicio.fecha"
                    mask="YYYY-MM-DD"
                    color="teal-8"
                    @update:model-value="mostrarCalendario = false"
                  />
                </q-dialog>

                <q-dialog v-model="mostrarReloj">
                  <q-time
                    v-model="servicio.hora"
                    mask="HH:mm"
                    format24h
                    color="teal-8"
                    @update:model-value="mostrarReloj = false"
                  />
                </q-dialog>

                <q-input
                  v-model.number="servicio.precio"
                  label="Precio cobrado *"
                  type="number"
                  outlined
                  dense
                  prefix="$"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val !== null && val !== '') || 'Escriba el precio',
                    (val) => val > 0 || 'El precio debe ser mayor a $0',
                    (val) =>
                      val <= 5000000 || 'Verifique el precio, parece muy alto',
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
                  v-model.number="servicio.abono"
                  label="Valor del abono *"
                  type="number"
                  outlined
                  dense
                  prefix="$"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val !== null && val !== '') ||
                      'Escriba el valor del abono',
                    (val) => val > 0 || 'El abono debe ser mayor a $0',
                    (val) =>
                      val < servicio.precio ||
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
const mostrarCalendario = ref(false);
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
  "Xiaomi",
  "Redmi",
  "Huawei",
  "Motorola",
  "Nokia",
  "Alcatel",
  "ZTE",
  "Oppo",
  "Realme",
  "LG",
  "Sony",
  "Honor",
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
/* Evita que el scroll del menú de opciones arrastre al modal de atrás */
.q-menu {
  overscroll-behavior: contain;
}
</style>

<style scoped>
/* ===== GRADIENTES ===== */
.bg-gradient {
  background: linear-gradient(135deg, #0d5c4f 0%, #1d7a6f 100%);
}

.bg-gradient-light {
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%);
}

/* ===== TARJETAS ===== */
.card-resumen {
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.card-resumen:hover {
  transform: translateY(-8px);
  border-color: currentColor;
}

.card-servicio {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e0e0e0;
}

.card-servicio:hover {
  transform: translateY(-6px) scale(1.02);
  border-color: #0d5c4f;
}

.shadow-hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.shadow-hover:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.shadow-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* ===== BÚSQUEDA ===== */
.search-input {
  transition: all 0.3s ease;
}

.search-input:focus-within {
  box-shadow: 0 0 0 3px rgba(13, 92, 79, 0.1);
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
    border-radius: 8px;
  }
}
</style>

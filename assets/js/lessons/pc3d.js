(function () {
'use strict';

var L = window.LAV;
var V3 = window.LAV3D;
var T = window.THREE;
var api = { ok: !!(V3 && V3.ok) };
window.PC3D = api;

function p(id, sr, en, dsr, den, tsr, ten) {
  return { id: id, sr: sr, en: en, role: { sr: dsr, en: den }, tip: { sr: tsr, en: ten } };
}

api.BOARD_PARTS = [
  p('cpu', 'Podnožje procesora', 'CPU socket',
    'Mesto gde se ugrađuje procesor (CPU), „mozak” računara. Podnožje ima stotine kontakata (LGA: pinovi su na ploči, AM: pinovi su na procesoru) i metalni okvir sa polugom koji drži procesor. Podnožje određuje koji procesori mogu da se koriste.',
    'The place where the processor (CPU), the "brain" of the computer, is installed. The socket has hundreds of contacts (LGA: the pins are on the board, PGA: the pins are on the processor) and a metal frame with a lever that holds the processor. The socket decides which processors can be used.',
    'Procesor se postavlja samo u jednom položaju: prati trougao na uglu. Nikad ne primenjuj silu.', 'A processor fits in only one orientation: follow the triangle on the corner. Never use force.'),
  p('ram', 'RAM slotovi (DIMM)', 'RAM slots (DIMM)',
    'Četiri duga ležišta za memorijske module. Radna memorija čuva programe i podatke koji se trenutno koriste. Ako se moduli stave u slotove iste boje (npr. 2 i 4), procesor ih koristi paralelno u dvokanalnom režimu, što ubrzava rad.',
    'Four long sockets for memory modules. The working memory holds the programs and data currently in use. If modules are put in slots of the same colour (e.g. 2 and 4), the processor uses them in parallel in dual-channel mode, which speeds things up.',
    'Modul ima urez koji ne dozvoljava pogrešno okretanje. Pritiskaj dok ne škljocnu obe bočne kopče.', 'A module has a notch that prevents it from being turned the wrong way. Press until both side clips click.'),
  p('pcie16', 'PCIe x16 slot', 'PCIe x16 slot',
    'Najduži i najbrži slot, direktno povezan sa procesorom. U njega ide grafička kartica. PCIe veza se sastoji od „traka” (lane): x16 znači 16 traka, a svaka generacija (3.0, 4.0, 5.0) udvostručuje brzinu po traci.',
    'The longest and fastest slot, connected directly to the processor. The graphics card goes in it. A PCIe link is made of "lanes": x16 means 16 lanes, and each generation (3.0, 4.0, 5.0) doubles the speed per lane.',
    'Plastična kvaka na kraju slota se pritisne da bi se kartica izvukla.', 'The plastic latch at the end of the slot is pressed to release the card.'),
  p('pcie1', 'PCIe x1 slotovi', 'PCIe x1 slots',
    'Kratki slotovi za manje zahtevne kartice: mrežne, zvučne, USB ili Wi-Fi kartice. Jedna traka je dovoljna za takve uređaje.',
    'Short slots for less demanding cards: network, sound, USB or Wi-Fi cards. A single lane is enough for such devices.',
    'Kartica manja od slota se može ugraditi u duži slot (x1 u x16).', 'A card smaller than the slot can be installed in a longer slot (x1 in x16).'),
  p('m2', 'M.2 slot', 'M.2 slot',
    'Mali slot u koji se uspravno-ležeće ugrađuje SSD u obliku štapića. NVMe SSD u njemu koristi PCIe trake, pa je višestruko brži od SATA diska. Drži se jednim zavrtnjem na kraju.',
    'A small slot where an SSD shaped like a stick is installed lying flat. An NVMe SSD in it uses PCIe lanes, so it is many times faster than a SATA drive. It is held by a single screw at the end.',
    'Dužina se piše u imenu: 2280 znači 22 mm širine i 80 mm dužine.', 'The length is in the name: 2280 means 22 mm wide and 80 mm long.'),
  p('sata', 'SATA portovi', 'SATA ports',
    'Portovi za povezivanje klasičnih HDD i SATA SSD diskova i optičkih uređaja tankim kablom. Najveća brzina je 6 Gb/s (oko 550 MB/s u praksi).',
    'Ports for connecting classic HDDs, SATA SSDs and optical drives with a thin cable. The top speed is 6 Gb/s (about 550 MB/s in practice).',
    'Za napajanje diska treba i poseban SATA kabl iz napajanja.', 'A drive also needs a separate SATA power cable from the power supply.'),
  p('chipset', 'Čipset', 'Chipset',
    'Čip pod hladnjakom koji povezuje procesor sa sporijim uređajima: USB, SATA, dodatnim PCIe trakama i mrežom. Određuje koliko ima portova i funkcija (npr. razlika između jeftine i skupe ploče iste generacije).',
    'The chip under a heatsink that connects the processor with the slower devices: USB, SATA, extra PCIe lanes and the network. It determines how many ports and features there are (for example the difference between a cheap and an expensive board of the same generation).',
    'Neke ploče nemaju ventilator na čipsetu, već samo pasivni hladnjak.', 'Some boards have no fan on the chipset, just a passive heatsink.'),
  p('vrm', 'VRM (naponski regulator)', 'VRM (voltage regulator)',
    'Skup MOSFET-ova, prigušnica i kondenzatora koji pretvara 12 V iz napajanja u nizak, tačan napon (oko 1 V) i veliku struju (i do 200 A) za procesor. Zagreva se, pa ima metalne hladnjake. Kvalitetniji VRM znači stabilnije napajanje procesora.',
    'A set of MOSFETs, chokes and capacitors that converts the 12 V from the power supply into a low, precise voltage (about 1 V) and a large current (up to 200 A) for the processor. It heats up, so it has metal heatsinks. A better VRM means steadier power for the processor.',
    'Broj „faza” (npr. 8+2) govori koliko je regulator podeljen na paralelne delove.', 'The number of "phases" (e.g. 8+2) tells how many parallel parts the regulator is split into.'),
  p('atx24', '24-pinski ATX konektor', '24-pin ATX connector',
    'Glavni konektor napajanja ploče. Iz napajanja donosi 3,3 V, 5 V i 12 V, kao i signale (PS_ON, Power Good) kojima ploča pali napajanje i proverava da li je napon ispravan.',
    'The main power connector of the board. It brings 3.3 V, 5 V and 12 V from the power supply, as well as signals (PS_ON, Power Good) with which the board switches the power supply on and checks that the voltage is correct.',
    'Ima kvaku i staje samo u jednom položaju. Gura se čvrsto dok kvaka ne škljocne.', 'It has a latch and fits in only one orientation. Push firmly until the latch clicks.'),
  p('eps', '8-pinski CPU konektor (EPS)', '8-pin CPU connector (EPS)',
    'Dodatno napajanje samo za procesor, na +12 V. Procesor troši mnogo, pa 24-pinski konektor ne bi bio dovoljan. Veće ploče imaju 8+4 pina.',
    'Extra power for the processor only, on +12 V. The processor draws a lot, so the 24-pin connector alone would not be enough. Larger boards have 8+4 pins.',
    'Ne mešaj ga sa PCIe konektorom grafičke kartice: izgledaju slično, ali se ne zamenjuju.', 'Do not mix it up with the graphics card PCIe connector: they look similar, but are not interchangeable.'),
  p('io', 'Zadnja ploča (I/O)', 'Rear panel (I/O)',
    'Skup spoljnih priključaka: USB, mrežni (LAN) port, video izlazi (HDMI, DisplayPort), audio utičnice i drugo. Čelični I/O štitnik se montira u kućište oko njih.',
    'The set of external connectors: USB, network (LAN) port, video outputs (HDMI, DisplayPort), audio jacks and more. A steel I/O shield is mounted in the case around them.',
    'Video izlaz sa ploče radi samo ako procesor ima ugrađenu grafiku.', 'The video output from the board only works if the processor has integrated graphics.'),
  p('cmos', 'CMOS baterija', 'CMOS battery',
    'Dugmasta baterija CR2032 (3 V) koja napaja mali čip sa časovnikom i podešavanjima BIOS-a kada je računar isključen. Ako se istroši, računar gubi datum i vreme i postavke.',
    'A CR2032 coin battery (3 V) that powers the small chip with the clock and the BIOS settings when the computer is off. If it runs out, the computer loses the date, time and settings.',
    'Vadi se kada treba da se resetuju BIOS postavke („Clear CMOS”).', 'It is taken out when the BIOS settings need to be reset ("Clear CMOS").'),
  p('bios', 'BIOS/UEFI čip', 'BIOS/UEFI chip',
    'Flash memorija sa osnovnim programom koji se pokreće prvi: proverava hardver (POST), omogućava podešavanja i zatim pokreće operativni sistem. Moderan naziv je UEFI.',
    'Flash memory holding the basic program that runs first: it checks the hardware (POST), allows settings and then starts the operating system. The modern name is UEFI.',
    'Ažuriranje BIOS-a može da doda podršku za novije procesore, ali ne sme da se prekida.', 'Updating the BIOS can add support for newer processors, but it must not be interrupted.'),
  p('fan', 'Konektor ventilatora', 'Fan header',
    'Četvoropinski konektor (+12 V, masa, tahometar, PWM) za ventilator procesora ili kućišta. Ploča očitava broj obrtaja i PWM signalom reguliše brzinu prema temperaturi.',
    'A four-pin header (+12 V, ground, tachometer, PWM) for the CPU or case fan. The board reads the rotation speed and regulates it with a PWM signal according to temperature.',
    'CPU_FAN mora biti povezan, inače ploča javlja grešku pri pokretanju.', 'CPU_FAN must be connected, otherwise the board reports an error at start-up.'),
  p('fpanel', 'Prednji panel (F_PANEL)', 'Front panel header',
    'Redovi pinova za dugme za uključivanje, reset, LED lampice i zvučnik kućišta. Ploča pali računar kratkim spojem dva pina.',
    'Rows of pins for the power button, reset, LEDs and the case speaker. The board turns the computer on by briefly shorting two pins.',
    'Raspored pinova je odštampan na ploči i u priručniku. Polaritet je bitan samo za LED.', 'The pin layout is printed on the board and in the manual. Polarity matters only for LEDs.'),
  p('usbh', 'Prednji USB i audio konektori', 'Front USB and audio headers',
    'Pinovi na koje se priključuju USB portovi i audio utičnice sa prednje strane kućišta. USB 3 ima širi konektor sa 19/20 pinova, a USB-C ima poseban konektor.',
    'Pins to which the USB ports and audio jacks on the front of the case are connected. USB 3 has a wider 19/20-pin connector, and USB-C has a dedicated connector.',
    'Konektori imaju ključ (urez) pa ne mogu da se okrenu naopako.', 'The connectors are keyed (notched) so they cannot be turned the wrong way round.'),
  p('holes', 'Rupe za zavrtnje', 'Mounting holes',
    'Rupe (obično 9 kod ATX ploče) kroz koje se ploča zavrtnjima pričvršćuje za odstojnike u kućištu. Njihov raspored je standardizovan za svaki form-faktor.',
    'Holes (usually 9 on an ATX board) through which the board is screwed to the standoffs in the case. Their layout is standardised for each form factor.',
    'Odstojnik se stavlja samo tamo gde ploča ima rupu, inače može da napravi kratak spoj.', 'A standoff is placed only where the board has a hole, otherwise it can cause a short circuit.')
];

api.PSU_PARTS = [
  p('body', 'Kućište napajanja', 'PSU housing',
    'Metalni oklop koji drži sve unutrašnje delove: ulazni filter smetnji, ispravljač sa PFC kolom, veliki kondenzator, prekidački tranzistori, transformator i izlazne ispravljače. Zaštićuje od dodira visokog napona i smetnji.',
    'A metal shell that holds all the internal parts: the input interference filter, the rectifier with the PFC circuit, the large capacitor, switching transistors, the transformer and the output rectifiers. It protects against touching high voltage and against interference.',
    'Nikad ne otvaraj napajanje: veliki kondenzator ostaje pod opasnim naponom i kada je isključeno.', 'Never open a power supply: the large capacitor stays at a dangerous voltage even when it is switched off.'),
  p('label', 'Nalepnica sa podacima', 'Rating label',
    'Na njoj piše ukupna snaga, struje po granama (+12 V, +5 V, +3,3 V), ulazni opseg napona i oznaka efikasnosti (80 PLUS). Najvažniji podatak je struja na +12 V jer glavnina komponenti troši baš iz te grane.',
    'It shows the total power, the currents of each rail (+12 V, +5 V, +3.3 V), the input voltage range and the efficiency mark (80 PLUS). The most important figure is the +12 V current, because most components draw from that rail.',
    'Ne veruj samo broju vati na kutiji: proveri koliko A daje grana +12 V.', 'Do not trust only the number of watts on the box: check how many amps the +12 V rail gives.'),
  p('fan', 'Ventilator', 'Fan',
    'Hladi unutrašnje delove, najčešće 120–140 mm. Na malom opterećenju mnoga napajanja zaustavljaju ventilator (zero-RPM), a brzina se menja prema temperaturi. Veliki ventilator radi tiše.',
    'It cools the internal parts, most often 120–140 mm. At a low load many power supplies stop the fan (zero-RPM), and the speed changes with temperature. A large fan runs more quietly.',
    'Ventilator usisava vazduh sa strane okrenute ka dnu kućišta ili ka unutrašnjosti; proveri uputstvo kućišta.', 'The fan draws air from the side facing the bottom of the case or the inside; check the case manual.'),
  p('inlet', 'Ulaz 230 V i prekidač', 'AC inlet and switch',
    'Utičnica (IEC C14) za mrežni kabl i glavni prekidač. Napajanje prima naizmeničnih 230 V (ili 115 V) i ima univerzalni ulaz. Prekidač potpuno odvaja kolo od mreže.',
    'The socket (IEC C14) for the mains cable and the main switch. The power supply takes 230 V (or 115 V) alternating voltage and has a universal input. The switch completely disconnects the circuit from the mains.',
    'Isključi prekidač i izvuci kabl pre bilo kakvog rada u kućištu.', 'Switch it off and pull the cable before any work inside the case.'),
  p('main24', '24-pinski ATX kabl', '24-pin ATX cable',
    'Glavni kabl za matičnu ploču. Nosi +3,3 V (narandžasta žica), +5 V (crvena), +12 V (žuta), masu (crna), +5 V stand-by (ljubičasta) i signale PS_ON (zelena) i Power Good (siva). Neka napajanja imaju 20+4 pina.',
    'The main cable for the motherboard. It carries +3.3 V (orange wire), +5 V (red), +12 V (yellow), ground (black), +5 V standby (purple) and the signals PS_ON (green) and Power Good (grey). Some power supplies have 20+4 pins.',
    'Zelena žica na masu pali napajanje: tako se testira bez ploče.', 'The green wire to ground turns the supply on: that is how it is tested without a board.'),
  p('eps', '4+4 pin CPU kabl (EPS)', '4+4 pin CPU cable (EPS)',
    'Posebno napajanje procesora na +12 V. Deli se na dva po 4 pina, da bi mogao da se ugradi i u ploče sa 4-pinskim konektorom. Skuplje ploče traže dva EPS kabla.',
    'A dedicated +12 V supply for the processor. It splits into two 4-pin halves so that it can also go into boards with a 4-pin connector. More expensive boards need two EPS cables.',
    'Utakni ga u konektor pored procesora, ne u PCIe konektor grafičke.', 'Plug it into the connector next to the processor, not the PCIe connector of the graphics card.'),
  p('pcie', '6+2 pin PCIe kabl', '6+2 pin PCIe cable',
    'Napajanje grafičke kartice: jedan 6-pinski deo daje do 75 W, a 8-pinski do 150 W (uz još 75 W iz PCIe slota). Najnovije kartice koriste jedan 12-pinski (12VHPWR) konektor do 600 W.',
    'Power for the graphics card: a 6-pin part gives up to 75 W, an 8-pin one up to 150 W (plus 75 W from the PCIe slot). The newest cards use a single 12-pin (12VHPWR) connector up to 600 W.',
    'Za jaku karticu koristi dva odvojena kabla, a ne jedan kabl sa dva konektora.', 'For a power-hungry card use two separate cables, not one cable with two connectors.'),
  p('sata', 'SATA kabl za napajanje', 'SATA power cable',
    'Plosnati konektor sa 15 pinova za HDD, SATA SSD i optičke uređaje. Daje +3,3 V, +5 V i +12 V. Na jednom kablu je obično 3 do 4 konektora.',
    'A flat 15-pin connector for HDDs, SATA SSDs and optical drives. It gives +3.3 V, +5 V and +12 V. There are usually 3 to 4 connectors on one cable.',
    'M.2 SSD ne koristi ovaj kabl: napaja se iz same ploče.', 'An M.2 SSD does not use this cable: it is powered from the board itself.'),
  p('molex', 'Molex konektor', 'Molex connector',
    'Stari 4-pinski konektor (+12 V, +5 V i dve mase) za ventilatore, kontrolere i starije uređaje. Danas se retko koristi, ali mnoga napajanja ga još imaju.',
    'The old 4-pin connector (+12 V, +5 V and two grounds) for fans, controllers and older devices. It is rarely used today, but many power supplies still have it.',
    'Ima zakošene ivice: ne može da se okrene naopako, ali traži dosta sile.', 'It has chamfered corners so it cannot be inserted the wrong way, but it takes quite some force.')
];

// fallback for browsers without WebGL: the same list and descriptions, without the model
api.staticUI = function (o) {
  var parts = o.parts, list = document.getElementById(o.listId), info = document.getElementById(o.infoId), cur = null;
  if (!list || !info) return;
  list.innerHTML = parts.map(function (x, i) {
    return '<button type="button" class="pc-part" data-id="' + x.id + '" aria-pressed="false"><b>' + (i + 1) + '</b><span>' + L.both(L.esc(x.sr), L.esc(x.en)) + '</span></button>';
  }).join('');
  function show() {
    list.querySelectorAll('.pc-part').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-id') === cur ? 'true' : 'false'); });
    var x = parts.filter(function (q) { return q.id === cur; })[0];
    info.innerHTML = x ? '<h3>' + L.both(L.esc(x.sr), L.esc(x.en)) + '</h3><p>' + L.both(L.esc(x.role.sr), L.esc(x.role.en)) + '</p><p class="pc-tip"><b>' + L.both('Savet', 'Tip') + '</b> ' + L.both(L.esc(x.tip.sr), L.esc(x.tip.en)) + '</p>' : '<p class="pc-hint">' + L.both('Izaberi deo sa liste.', 'Pick a part from the list.') + '</p>';
  }
  list.addEventListener('click', function (e) { var b = e.target.closest('.pc-part'); if (b) { cur = b.getAttribute('data-id'); show(); } });
  show();
};

if (!api.ok) return;

var Cc = V3.C;
var DARK = 0x14181d;
function mat(c, o) { return V3.std(c, o); }
function box(w, h, d, c, o) { return new T.Mesh(new T.BoxGeometry(w, h, d), mat(c, o)); }
function cyl(r, h, c, o, seg) { return new T.Mesh(new T.CylinderGeometry(r, r, h, seg || 20), mat(c, o)); }
function put(g, m, x, y, z) { m.position.set(x, y, z); g.add(m); return m; }
var TOP = 0.02;

function traceTexture() {
  var c = document.createElement('canvas');
  c.width = 1024; c.height = 820;
  var x = c.getContext('2d');
  x.fillStyle = '#1c3d32';
  x.fillRect(0, 0, c.width, c.height);
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  x.strokeStyle = 'rgba(120,190,150,.22)';
  x.lineWidth = 2;
  for (var i = 0; i < 170; i++) {
    var px = rnd() * 1024, py = rnd() * 820;
    x.beginPath(); x.moveTo(px, py);
    for (var s = 0; s < 3; s++) {
      var dx = (rnd() < 0.5 ? 1 : -1) * (30 + rnd() * 110), dy = rnd() < 0.5 ? 0 : (rnd() < 0.5 ? 1 : -1) * (20 + rnd() * 70);
      px += dx; py += dy; x.lineTo(px, py);
    }
    x.stroke();
    x.fillStyle = 'rgba(210,180,90,.35)';
    x.beginPath(); x.arc(px, py, 3.2, 0, Math.PI * 2); x.fill();
  }
  x.strokeStyle = 'rgba(240,240,240,.28)';
  x.lineWidth = 3;
  x.strokeRect(14, 14, 996, 792);
  var tex = new T.CanvasTexture(c);
  return tex;
}

// the whole ATX motherboard lies flat: x is the long side (I/O on the left), z is the short side (slots at the bottom)
api.buildBoard = function () {
  var root = new T.Group();
  var parts = {};
  var board = new T.Group();
  root.add(board);
  var pcb = box(3.05, 0.04, 2.44, 0x1c3d32);
  put(board, pcb, 0, 0, 0);
  var top = new T.Mesh(new T.PlaneGeometry(3.05, 2.44), new T.MeshStandardMaterial({ map: traceTexture(), roughness: 0.6, metalness: 0.1 }));
  top.rotation.x = -Math.PI / 2;
  top.position.y = 0.0201;
  board.add(top);

  function part(id) {
    var g = new T.Group();
    g.userData.id = id;
    board.add(g);
    parts[id] = { id: id, group: g };
    return g;
  }

  // CPU socket with the processor
  var g = part('cpu');
  put(g, box(0.52, 0.05, 0.52, 0x1a1d22), -0.45, TOP + 0.025, -0.35);
  put(g, box(0.47, 0.02, 0.47, 0xaeb6bf, { metalness: 0.7, roughness: 0.35 }), -0.45, TOP + 0.06, -0.35);
  var cpu = box(0.38, 0.035, 0.38, 0xc9d0d8, { metalness: 0.75, roughness: 0.3 });
  put(g, cpu, -0.45, TOP + 0.085, -0.35);
  put(g, box(0.16, 0.036, 0.16, 0xaab3bd, { metalness: 0.7, roughness: 0.3 }), -0.45, TOP + 0.087, -0.35);
  put(g, cyl(0.012, 0.5, 0xd8dde3, { metalness: 0.8 }, 10), -0.45, TOP + 0.075, -0.07).rotation.z = Math.PI / 2;
  parts.cpu.cpuMesh = cpu;

  // RAM slots
  g = part('ram');
  [0.3, 0.42, 0.54, 0.66].forEach(function (x, i) {
    put(g, box(0.075, 0.09, 1.36, i % 2 ? 0x15181d : 0x3a4048), x, TOP + 0.045, -0.42);
    put(g, box(0.075, 0.1, 0.05, 0xd8dde3), x, TOP + 0.05, 0.3);
    put(g, box(0.075, 0.1, 0.05, 0xd8dde3), x, TOP + 0.05, -1.14);
  });

  // PCIe slots
  g = part('pcie16');
  put(g, box(0.89, 0.1, 0.08, DARK), -0.55, TOP + 0.05, 0.36);
  put(g, box(0.89, 0.1, 0.08, 0x2c3239), -0.55, TOP + 0.05, 0.86);
  put(g, box(0.09, 0.11, 0.095, 0xd8dde3), -0.06, TOP + 0.055, 0.36);
  g = part('pcie1');
  put(g, box(0.28, 0.1, 0.08, DARK), -0.86, TOP + 0.05, 0.62);
  put(g, box(0.28, 0.1, 0.08, DARK), -0.86, TOP + 0.05, 1.08);

  // M.2
  g = part('m2');
  put(g, box(0.13, 0.05, 0.24, 0xd8b84c, { metalness: 0.8, roughness: 0.3 }), -0.96, TOP + 0.025, 0.14);
  put(g, cyl(0.035, 0.06, 0xd8b84c, { metalness: 0.8 }), -0.15, TOP + 0.03, 0.14);
  put(g, box(0.82, 0.008, 0.22, 0x2d3640, { transparent: true, opacity: 0.0 }), -0.55, TOP + 0.075, 0.14).visible = false;

  // SATA
  g = part('sata');
  for (var s = 0; s < 6; s++) put(g, box(0.2, 0.1, 0.075, 0x1d2228), 1.22, TOP + 0.05, 0.36 + s * 0.1);
  for (s = 0; s < 6; s++) put(g, box(0.05, 0.02, 0.04, 0xd8dde3, { metalness: 0.7 }), 1.3, TOP + 0.108, 0.36 + s * 0.1);

  // chipset
  g = part('chipset');
  put(g, box(0.4, 0.03, 0.4, 0x15171a), 0.62, TOP + 0.015, 0.52);
  put(g, box(0.34, 0.075, 0.34, 0x7d8792, { metalness: 0.6, roughness: 0.4 }), 0.62, TOP + 0.065, 0.52);
  for (s = -2; s <= 2; s++) put(g, box(0.34, 0.03, 0.025, 0x98a2ad, { metalness: 0.6 }), 0.62, TOP + 0.115, 0.52 + s * 0.065);

  // VRM
  g = part('vrm');
  put(g, box(1.22, 0.16, 0.16, 0x87909a, { metalness: 0.6, roughness: 0.4 }), -0.5, TOP + 0.08, -0.86);
  for (s = 0; s < 13; s++) put(g, box(0.02, 0.05, 0.17, 0xa5aeb8, { metalness: 0.6 }), -1.08 + s * 0.1, TOP + 0.185, -0.86);
  put(g, box(0.16, 0.16, 0.66, 0x87909a, { metalness: 0.6, roughness: 0.4 }), -1.0, TOP + 0.08, -0.35);
  for (s = 0; s < 8; s++) put(g, box(0.17, 0.05, 0.02, 0xa5aeb8, { metalness: 0.6 }), -1.0, TOP + 0.185, -0.66 + s * 0.09);
  for (s = 0; s < 7; s++) put(g, box(0.1, 0.1, 0.1, 0x2d3036), -0.78 + s * 0.12, TOP + 0.05, -0.7);
  for (s = 0; s < 8; s++) {
    put(g, cyl(0.045, 0.13, 0x2b2f36), -1.05 + s * 0.14, TOP + 0.065, -1.06);
    put(g, cyl(0.046, 0.01, 0xd8b84c, { metalness: 0.8 }), -1.05 + s * 0.14, TOP + 0.13, -1.06);
  }

  // power connectors
  g = part('atx24');
  put(g, box(0.17, 0.19, 0.54, 0xd9d3c0), 1.42, TOP + 0.095, -0.2);
  for (s = 0; s < 12; s++) { put(g, box(0.05, 0.02, 0.025, 0xb7a35c, { metalness: 0.8 }), 1.38, TOP + 0.195, -0.43 + s * 0.042); put(g, box(0.05, 0.02, 0.025, 0xb7a35c, { metalness: 0.8 }), 1.46, TOP + 0.195, -0.43 + s * 0.042); }
  g = part('eps');
  put(g, box(0.33, 0.19, 0.17, 0xb9b3a2), -0.58, TOP + 0.095, -1.13);
  for (s = 0; s < 4; s++) { put(g, box(0.04, 0.02, 0.05, 0xb7a35c, { metalness: 0.8 }), -0.7 + s * 0.08, TOP + 0.195, -1.09); put(g, box(0.04, 0.02, 0.05, 0xb7a35c, { metalness: 0.8 }), -0.7 + s * 0.08, TOP + 0.195, -1.17); }

  // rear I/O
  g = part('io');
  put(g, box(0.34, 0.32, 1.0, 0x9aa3ad, { metalness: 0.6, roughness: 0.4 }), -1.35, TOP + 0.16, -0.58);
  put(g, box(0.32, 0.24, 0.36, 0x9aa3ad, { metalness: 0.6, roughness: 0.4 }), -1.35, TOP + 0.12, 0.12);
  [[-0.9, 0x2f6fe0], [-0.76, 0x2f6fe0], [-0.62, 0x2f6fe0], [-0.48, 0x15181d], [-0.34, 0x15181d]].forEach(function (u) { put(g, box(0.03, 0.09, 0.1, u[1]), -1.53, TOP + 0.13, u[0]); });
  put(g, box(0.03, 0.12, 0.16, 0x15181d), -1.53, TOP + 0.26, -0.8);
  put(g, box(0.03, 0.12, 0.16, 0x15181d), -1.53, TOP + 0.26, -0.55);
  put(g, box(0.03, 0.12, 0.14, 0x15181d), -1.53, TOP + 0.26, -0.3);
  [0x6fcf97, 0x6cc6ee, 0xf28b82, 0xffb468].forEach(function (c, i) { var j = cyl(0.045, 0.04, c, null, 14); j.rotation.z = Math.PI / 2; put(g, j, -1.52, TOP + 0.12, -0.02 + i * 0.1); });

  // CMOS battery
  g = part('cmos');
  put(g, box(0.25, 0.045, 0.25, 0x1d2228), 0.08, TOP + 0.022, 0.78);
  put(g, cyl(0.1, 0.035, 0xc9d0d8, { metalness: 0.8, roughness: 0.3 }, 28), 0.08, TOP + 0.062, 0.78);

  // BIOS
  g = part('bios');
  put(g, box(0.24, 0.03, 0.16, 0x15171a), 0.98, TOP + 0.015, 1.02);
  for (s = 0; s < 4; s++) { put(g, box(0.012, 0.012, 0.03, 0xc9d0d8, { metalness: 0.8 }), 0.9 + s * 0.05, TOP + 0.01, 0.92); put(g, box(0.012, 0.012, 0.03, 0xc9d0d8, { metalness: 0.8 }), 0.9 + s * 0.05, TOP + 0.01, 1.12); }

  // fan header
  g = part('fan');
  put(g, box(0.22, 0.1, 0.075, 0xe8e4d8), 0.12, TOP + 0.05, -1.16);
  put(g, box(0.22, 0.1, 0.075, 0xe8e4d8), 1.1, TOP + 0.05, 1.12);

  // front panel + USB/audio headers
  g = part('fpanel');
  put(g, box(0.32, 0.075, 0.09, 0x15181d), 1.0, TOP + 0.038, 1.17);
  for (s = 0; s < 9; s++) { put(g, box(0.014, 0.05, 0.014, 0xd8b84c, { metalness: 0.8 }), 0.87 + s * 0.035, TOP + 0.1, 1.15); put(g, box(0.014, 0.05, 0.014, 0xd8b84c, { metalness: 0.8 }), 0.87 + s * 0.035, TOP + 0.1, 1.19); }
  g = part('usbh');
  put(g, box(0.28, 0.1, 0.09, 0x15171a), 0.5, TOP + 0.05, 1.17);
  put(g, box(0.22, 0.075, 0.09, 0x15171a), -1.18, TOP + 0.038, 1.17);
  put(g, box(0.16, 0.1, 0.36, 0x15171a), 1.3, TOP + 0.05, -0.74);

  // mounting holes
  g = part('holes');
  [[-1.44, -1.15], [1.44, -1.15], [-1.44, 1.15], [1.44, 1.15], [-0.06, -1.15], [-0.06, 1.15], [-1.44, 0.2], [1.44, 0.2], [0.8, -0.65]].forEach(function (h) {
    var ring = new T.Mesh(new T.TorusGeometry(0.055, 0.016, 8, 24), mat(0xd8b84c, { metalness: 0.8, roughness: 0.3 }));
    ring.rotation.x = Math.PI / 2;
    put(g, ring, h[0], TOP + 0.012, h[1]);
  });

  // installed components, shown with the "components" switch
  var extras = new T.Group();
  board.add(extras);
  var cooler = new T.Group();
  put(cooler, box(0.42, 0.025, 0.42, 0xb4693c, { metalness: 0.8, roughness: 0.35 }), -0.45, TOP + 0.13, -0.35);
  for (s = 0; s < 16; s++) put(cooler, box(0.5, 0.012, 0.42, 0xa8b0b8, { metalness: 0.7, roughness: 0.4 }), -0.45, TOP + 0.17 + s * 0.045, -0.35);
  var fan = cyl(0.19, 0.04, 0x2a2f36, null, 28);
  fan.rotation.z = Math.PI / 2;
  put(cooler, fan, -0.45 + 0.28, TOP + 0.5, -0.35);
  extras.add(cooler);
  var ramg = new T.Group();
  [0.42, 0.66].forEach(function (x) {
    put(ramg, box(0.04, 0.31, 1.33, 0x2a3a55, { metalness: 0.5, roughness: 0.4 }), x, TOP + 0.09 + 0.155, -0.42);
    put(ramg, box(0.042, 0.02, 1.33, 0x6cc6ee, { emissive: 0x1d6c8d }), x, TOP + 0.09 + 0.31, -0.42);
  });
  extras.add(ramg);
  var gpu = new T.Group();
  put(gpu, box(2.55, 1.05, 0.38, 0x1b1f25, { metalness: 0.3, roughness: 0.5 }), -0.22, TOP + 0.58, 0.46);
  [-0.85, 0.2, 0.9].forEach(function (x) {
    var f = cyl(0.3, 0.02, 0x0c0f13, null, 32);
    f.rotation.x = Math.PI / 2;
    put(gpu, f, x - 0.1, TOP + 0.58, 0.66);
    var hub = cyl(0.07, 0.03, 0x6cc6ee, { emissive: 0x1d6c8d }, 20);
    hub.rotation.x = Math.PI / 2;
    put(gpu, hub, x - 0.1, TOP + 0.58, 0.675);
  });
  put(gpu, box(0.03, 1.05, 0.38, 0x9aa3ad, { metalness: 0.6 }), -1.52, TOP + 0.58, 0.46);
  extras.add(gpu);
  var ssd = new T.Group();
  put(ssd, box(0.8, 0.014, 0.22, 0x2d3640), -0.54, TOP + 0.085, 0.14);
  put(ssd, box(0.2, 0.012, 0.16, 0x121417), -0.8, TOP + 0.098, 0.14);
  put(ssd, box(0.14, 0.012, 0.14, 0x121417), -0.5, TOP + 0.098, 0.14);
  put(ssd, box(0.14, 0.012, 0.14, 0x121417), -0.25, TOP + 0.098, 0.14);
  extras.add(ssd);
  extras.visible = false;

  Object.keys(parts).forEach(function (id) {
    var pt = parts[id];
    pt.meshes = [];
    pt.group.traverse(function (o) { if (o.isMesh) { o.userData.partId = id; pt.meshes.push(o); } });
  });
  root.userData.parts = parts;
  root.userData.extras = extras;
  root.userData.groups = { cooler: cooler, ram: ramg, gpu: gpu, ssd: ssd };
  return root;
};

// helpers shared by the interactive parts lists
api.worldBox = function (obj, id) {
  var b = new T.Box3();
  obj.userData.parts[id].group.traverse(function (o) { if (o.isMesh) b.expandByObject(o); });
  return b;
};

api.attachUI = function (o) {
  // o: { fig, st, root, parts[], listId, infoId, markers }
  var st = o.st, root = o.root, parts = o.parts, byId = {};
  parts.forEach(function (x) { byId[x.id] = x; });
  var objs = o.objs || root.userData.parts;
  var list = document.getElementById(o.listId), info = document.getElementById(o.infoId);
  var cur = null, outline = null, home = { target: st.target.clone(), dist: st.dist, phi: st.phi };
  var want = { target: st.target.clone(), dist: st.dist, phi: st.phi }, moveUntil = 0;
  var boxes = {};
  Object.keys(objs).forEach(function (id) {
    var b = new T.Box3();
    objs[id].group.traverse(function (m) { if (m.isMesh) b.expandByObject(m); });
    objs[id].box = b;
  });
  if (list) {
    list.innerHTML = parts.map(function (x, i) {
      return '<button type="button" class="pc-part" data-id="' + x.id + '" aria-pressed="false"><b>' + (i + 1) + '</b><span>' + L.both(L.esc(x.sr), L.esc(x.en)) + '</span></button>';
    }).join('');
    list.addEventListener('click', function (e) {
      var b = e.target.closest('.pc-part');
      if (b) select(cur === b.getAttribute('data-id') ? null : b.getAttribute('data-id'));
    });
  }
  function describe() {
    if (!info) return;
    if (!cur) {
      info.innerHTML = '<p class="pc-hint">' + L.both('Klikni na deo na modelu ili na listu da vidiš šta radi.', 'Click a part on the model or in the list to see what it does.') + '</p>';
      return;
    }
    var x = byId[cur], i = parts.indexOf(x) + 1;
    info.innerHTML = '<h3><span class="pc-n">' + i + '</span>' + L.both(L.esc(x.sr), L.esc(x.en)) + '</h3>' +
      '<p>' + L.both(L.esc(x.role.sr), L.esc(x.role.en)) + '</p>' +
      '<p class="pc-tip"><b>' + L.both('Savet', 'Tip') + '</b> ' + L.both(L.esc(x.tip.sr), L.esc(x.tip.en)) + '</p>';
  }
  function select(id) {
    cur = id;
    if (list) list.querySelectorAll('.pc-part').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-id') === id ? 'true' : 'false'); });
    if (outline) { st.scene.remove(outline); outline.geometry.dispose(); outline = null; }
    if (id && objs[id]) {
      var b = objs[id].box, size = new T.Vector3(), ctr = new T.Vector3();
      b.getSize(size); b.getCenter(ctr);
      if (o.worldFn) ctr = o.worldFn(ctr);
      outline = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(size.x + 0.06, size.y + 0.06, size.z + 0.06)), new T.LineBasicMaterial({ color: Cc.field, depthTest: false, transparent: true }));
      outline.renderOrder = 20;
      outline.position.copy(ctr);
      if (o.worldQuat) outline.quaternion.copy(o.worldQuat);
      st.scene.add(outline);
      want.target.copy(ctr);
      want.dist = Math.max(2.8, Math.max(size.x, size.z) * 1.8 + 1.6);
      want.phi = o.focusPhi == null ? 0.6 : o.focusPhi;
    } else {
      want.target.copy(home.target);
      want.dist = home.dist;
      want.phi = home.phi;
    }
    moveUntil = performance.now() + 1800;
    describe();
  }
  st.updaters.push(function (dt, t) {
    var k = 1 - Math.exp(-dt * 4);
    st.target.lerp(want.target, k);
    st.dist += (want.dist - st.dist) * k;
    if (performance.now() < moveUntil) st.phi += (want.phi - st.phi) * k;
    Object.keys(objs).forEach(function (id) {
      var on = id === cur, pulse = on ? 0.35 + 0.25 * Math.sin(t * 5) : 0;
      objs[id].meshes.forEach(function (m) {
        if (!m.material.emissive) return;
        if (m.userData.e0 === undefined) m.userData.e0 = { c: m.material.emissive.getHex(), i: m.material.emissiveIntensity };
        if (on) { m.material.emissive.setHex(Cc.field); m.material.emissiveIntensity = pulse; }
        else { m.material.emissive.setHex(m.userData.e0.c); m.material.emissiveIntensity = m.userData.e0.i; }
      });
    });
  });
  // picking
  var cv = st.canvas, ray = new T.Raycaster(), down = null;
  cv.addEventListener('pointerdown', function (e) { down = [e.clientX, e.clientY]; });
  cv.addEventListener('pointerup', function (e) {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) { down = null; return; }
    down = null;
    var r = cv.getBoundingClientRect();
    ray.setFromCamera(new T.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), st.camera);
    var meshes = [];
    Object.keys(objs).forEach(function (id) { if (objs[id].group.visible !== false) meshes = meshes.concat(objs[id].meshes); });
    var hit = ray.intersectObjects(meshes, false)[0];
    select(hit ? hit.object.userData.partId : null);
  });
  describe();
  return { select: select, current: function () { return cur; } };
};

api.buildPSU = function () {
  var root = new T.Group(), parts = {};
  function part(id) { var g = new T.Group(); g.userData.id = id; root.add(g); parts[id] = { id: id, group: g }; return g; }
  var g = part('body');
  put(g, box(1.5, 0.86, 1.4, 0x2b3139, { metalness: 0.5, roughness: 0.45 }), 0, 0.43, 0);
  put(g, box(1.52, 0.02, 1.42, 0x1a1e24), 0, 0.01, 0);
  g = part('label');
  var cv = document.createElement('canvas');
  cv.width = 512; cv.height = 256;
  var x = cv.getContext('2d');
  x.fillStyle = '#e9edf1'; x.fillRect(0, 0, 512, 256);
  x.fillStyle = '#141d26'; x.font = '800 40px Archivo, Arial'; x.fillText('ATX 650 W', 20, 56);
  x.font = '600 24px Arial'; x.fillText('80 PLUS GOLD', 20, 92);
  x.font = '500 20px Arial';
  ['INPUT: 100-240 V~ 50-60 Hz 9-4.5 A', '+3.3 V  20 A    +5 V  20 A', '+12 V  54 A   −12 V  0.3 A', '+5 Vsb  3 A     650 W MAX'].forEach(function (t, i) { x.fillText(t, 20, 136 + i * 30); });
  var lab = new T.Mesh(new T.PlaneGeometry(1.2, 0.6), new T.MeshStandardMaterial({ map: new T.CanvasTexture(cv), roughness: 0.7 }));
  lab.rotation.y = Math.PI / 2;
  lab.position.set(0.762, 0.43, 0.0);
  g.add(lab);
  g = part('fan');
  var fanG = new T.Group();
  fanG.position.set(0, 0.87, 0);
  g.add(fanG);
  var ring = new T.Mesh(new T.TorusGeometry(0.62, 0.025, 8, 40), mat(0x0c0f13));
  ring.rotation.x = Math.PI / 2;
  fanG.add(ring);
  var blades = new T.Group();
  for (var i = 0; i < 9; i++) {
    var bl = box(0.34, 0.012, 0.13, 0x3c444e);
    bl.position.set(0.3, 0, 0);
    bl.rotation.y = 0.35;
    var holder = new T.Group();
    holder.rotation.y = i / 9 * Math.PI * 2;
    holder.add(bl);
    blades.add(holder);
  }
  fanG.add(blades);
  put(fanG, cyl(0.12, 0.04, 0x0c0f13, null, 20), 0, 0.01, 0);
  for (i = 1; i <= 3; i++) { var gr = new T.Mesh(new T.TorusGeometry(i * 0.17, 0.006, 6, 40), mat(0x9aa3ad, { metalness: 0.7 })); gr.rotation.x = Math.PI / 2; gr.position.y = 0.03; fanG.add(gr); }
  root.userData.fanBlades = blades;
  g = part('inlet');
  put(g, box(0.5, 0.32, 0.06, 0x111418), 0.35, 0.5, -0.72);
  put(g, box(0.3, 0.14, 0.04, 0x1b1f25), 0.35, 0.5, -0.76);
  [-0.07, 0.07].forEach(function (dx) { put(g, box(0.03, 0.08, 0.05, 0xd8b84c, { metalness: 0.8 }), 0.35 + dx, 0.5, -0.8); });
  put(g, box(0.22, 0.14, 0.05, 0xc23a3a), -0.35, 0.62, -0.72);
  put(g, box(0.12, 0.1, 0.03, 0xe8e4d8), -0.35, 0.62, -0.75);
  // cable bundles end in connectors lying on the floor in front of the unit
  function cable(id, ox, oy, pts, radius, colors, conn) {
    var gg = part(id);
    var curve = new T.CatmullRomCurve3([new T.Vector3(ox, oy, 0.7)].concat(pts));
    colors.forEach(function (c, k) {
      var tube = new T.Mesh(new T.TubeGeometry(curve, 40, radius, 8, false), mat(c));
      tube.position.x += (k - (colors.length - 1) / 2) * radius * 1.7;
      gg.add(tube);
    });
    var end = pts[pts.length - 1];
    conn(gg, end);
    return gg;
  }
  var floorY = 0.1;
  cable('main24', -0.55, 0.62, [new T.Vector3(-0.7, 0.45, 1.2), new T.Vector3(-1.1, floorY, 1.9), new T.Vector3(-1.2, floorY, 2.3)], 0.022, [0xf2c94c, 0xe85d3a, 0xff9a3c, 0x16191e, 0x7a4ec2, 0x2fbf6a], function (gg, e) {
    put(gg, box(0.17, 0.19, 0.54, 0xe8e4d8), e.x, 0.095, e.z + 0.2);
  });
  cable('eps', -0.2, 0.42, [new T.Vector3(-0.3, 0.3, 1.3), new T.Vector3(-0.5, floorY, 2.1), new T.Vector3(-0.5, floorY, 2.6)], 0.022, [0xf2c94c, 0x16191e], function (gg, e) {
    put(gg, box(0.33, 0.17, 0.17, 0xb9b3a2), e.x, 0.085, e.z + 0.1);
  });
  cable('pcie', 0.18, 0.5, [new T.Vector3(0.2, 0.3, 1.4), new T.Vector3(0.2, floorY, 2.2), new T.Vector3(0.2, floorY, 2.9)], 0.022, [0xf2c94c, 0x16191e], function (gg, e) {
    put(gg, box(0.33, 0.17, 0.17, 0x6cc6ee, { metalness: 0.2 }), e.x, 0.085, e.z + 0.1);
    put(gg, box(0.16, 0.17, 0.17, 0x4aa3cc), e.x + 0.245, 0.085, e.z + 0.1);
  });
  cable('sata', 0.55, 0.36, [new T.Vector3(0.7, 0.3, 1.2), new T.Vector3(0.95, floorY, 1.8), new T.Vector3(0.95, floorY, 2.7)], 0.02, [0x22262d, 0xf2c94c, 0xe85d3a], function (gg, e) {
    [0, -0.35, -0.7].forEach(function (dz) { put(gg, box(0.12, 0.09, 0.09, 0x1d2228), e.x, 0.045, e.z + dz); put(gg, box(0.12, 0.03, 0.04, 0xdadde1), e.x, 0.105, e.z + dz); });
  });
  cable('molex', 0.7, 0.62, [new T.Vector3(1.1, 0.5, 1.2), new T.Vector3(1.5, floorY, 1.7), new T.Vector3(1.6, floorY, 2.3)], 0.02, [0xf2c94c, 0x16191e, 0xe85d3a, 0x16191e], function (gg, e) {
    put(gg, box(0.22, 0.2, 0.12, 0xeceff1), e.x, 0.1, e.z + 0.06);
  });
  put(root, box(4.6, 0.01, 3.6, 0x1b2836), 0.2, -0.005, 1.5);
  Object.keys(parts).forEach(function (id) {
    var pt = parts[id];
    pt.meshes = [];
    pt.group.traverse(function (o) { if (o.isMesh) { o.userData.partId = id; pt.meshes.push(o); } });
  });
  root.userData.parts = parts;
  return root;
};

// animated "data and power paths" drawn over the board, one group per view
api.buildOverlays = function () {
  var Y = 0.07, out = {};
  function pts(a) { return a.map(function (q) { return new T.Vector3(q[0], Y, q[1]); }); }
  var defs = {
    power: { color: 0xffb468, paths: [
      [[1.34, -0.2], [0.95, -0.2], [0.95, -0.92], [0.2, -0.92], [-0.2, -0.88]],
      [[-0.58, -1.1], [-0.58, -0.92], [-0.58, -0.7]],
      [[-0.9, -0.82], [-0.9, -0.5], [-0.72, -0.4]],
      [[-0.7, -0.78], [-0.6, -0.62]],
      [[1.34, 0.0], [0.92, 0.2], [0.65, 0.4]],
      [[1.2, -0.3], [0.9, -0.3], [0.7, -0.3]]
    ] },
    memory: { color: 0x6cc6ee, paths: [
      [[-0.22, -0.55], [0.3, -0.55]], [[-0.22, -0.48], [0.42, -0.48]],
      [[-0.22, -0.4], [0.54, -0.4]], [[-0.22, -0.32], [0.66, -0.32]]
    ] },
    pcie: { color: 0x6fcf97, paths: [
      [[-0.55, -0.1], [-0.55, 0.32]], [[-0.45, -0.1], [-0.45, 0.32]],
      [[-0.75, -0.1], [-0.75, 0.14], [-0.9, 0.14]],
      [[0.5, 0.4], [0.3, 0.62], [-0.7, 0.62], [-0.84, 0.62]]
    ] },
    storage: { color: 0xb39bf2, paths: [
      [[-0.22, -0.2], [0.2, 0.15], [0.5, 0.45]],
      [[0.82, 0.5], [1.1, 0.5], [1.15, 0.5]], [[0.8, 0.58], [1.1, 0.68]], [[0.8, 0.42], [1.1, 0.4]]
    ] },
    io: { color: 0xf5c84c, paths: [
      [[0.45, 0.58], [-0.1, 0.72], [-1.0, 0.72], [-1.25, 0.2], [-1.35, 0.1]],
      [[0.8, 0.62], [0.9, 1.0], [1.0, 1.1]], [[0.4, 0.62], [0.5, 1.08]]
    ] }
  };
  Object.keys(defs).forEach(function (k) {
    var f = V3.makeFlow(defs[k].paths.map(pts), { color: defs[k].color, spacing: 0.17, size: 0.1, lineOpacity: 0.75 });
    f.group.visible = false;
    out[k] = f;
  });
  return out;
};

// ---------- case model ----------
var CASES = {
  full: { w: 23, h: 55, d: 55, sr: 'Full tower', en: 'Full tower', boards: 'E-ATX · ATX · mATX · ITX', slots: 8, bays: 10, fans: 9 },
  mid: { w: 21, h: 46, d: 45, sr: 'Mid tower', en: 'Mid tower', boards: 'ATX · mATX · ITX', slots: 7, bays: 6, fans: 6 },
  mini: { w: 18, h: 38, d: 40, sr: 'Mini tower', en: 'Mini tower', boards: 'mATX · ITX', slots: 4, bays: 3, fans: 3 },
  sff: { w: 20, h: 30, d: 34, sr: 'Mini-ITX (SFF)', en: 'Mini-ITX (SFF)', boards: 'Mini-ITX', slots: 2, bays: 2, fans: 2 },
  desk: { w: 42, h: 10, d: 40, sr: 'Desktop (horizontalno)', en: 'Desktop (horizontal)', boards: 'mATX · ITX', slots: 2, bays: 2, fans: 1 }
};
api.CASES = CASES;

api.buildCase = function (st, kind, boardKey) {
  var c = CASES[kind], s = 0.1;
  var W = c.w * s, H = c.h * s, D = c.d * s;
  var g = new T.Group();
  var shell = new T.Mesh(new T.BoxGeometry(W, H, D), new T.MeshStandardMaterial({ color: 0x6a7886, transparent: true, opacity: 0.16, roughness: 0.3, metalness: 0.3, side: T.DoubleSide, depthWrite: false }));
  g.add(shell);
  var edges = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(W, H, D)), new T.LineBasicMaterial({ color: 0xa6b4c2 }));
  g.add(edges);
  // front is -z, rear is +z; the open side is +x; the board stands against the -x wall
  var bw = { atx: [30.5, 24.4], matx: [24.4, 24.4], itx: [17, 17], eatx: [30.5, 33] }[boardKey] || [30.5, 24.4];
  var horizontal = kind === 'desk';
  var bd = box(horizontal ? bw[0] * s : 0.03, horizontal ? 0.03 : bw[1] * s, horizontal ? bw[1] * s : bw[0] * s, 0x1c3d32);
  if (horizontal) put(g, bd, -W / 2 + bw[0] * s / 2 + 0.2, -H / 2 + 0.25, 0);
  else put(g, bd, -W / 2 + 0.2, H / 2 - 0.3 - bw[1] * s / 2, D / 2 - bw[0] * s / 2 - 0.15);
  // psu
  var psuS = kind === 'sff' ? [12.5, 6.3, 10] : [15, 8.6, 14];
  var psu = box(horizontal ? psuS[0] * s : psuS[1] * s, horizontal ? psuS[1] * s : psuS[1] * s, psuS[2] * s, 0x2b3139, { metalness: 0.4 });
  if (horizontal) put(g, psu, W / 2 - psuS[0] * s / 2 - 0.1, -H / 2 + psuS[1] * s / 2 + 0.02, D / 2 - psuS[2] * s / 2 - 0.1);
  else put(g, psu, 0, -H / 2 + psuS[1] * s / 2 + 0.02, D / 2 - psuS[2] * s / 2 - 0.1);
  // drive cage
  if (!horizontal) for (var i = 0; i < Math.min(c.bays, 4); i++) put(g, box(W * 0.55, 0.12, 0.7, 0x3a424c), W * 0.12, -H / 2 + 1.2 + i * 0.16 + (kind === 'sff' ? 0.2 : 0), -D / 2 + 0.55);
  // front fans (intake) and rear fan (exhaust)
  var fanR = kind === 'sff' ? 0.4 : 0.6, fans = [];
  function addFan(x, y, z, axis) {
    var f = cyl(fanR, 0.08, 0x0f1216, null, 28);
    if (axis === 'z') f.rotation.x = Math.PI / 2;
    put(g, f, x, y, z);
    var hub = cyl(fanR * 0.3, 0.1, Cc.field, { emissive: 0x1d6c8d }, 16);
    if (axis === 'z') hub.rotation.x = Math.PI / 2;
    put(g, hub, x, y, z);
    fans.push(f);
  }
  if (horizontal) {
    addFan(-W / 2 + 0.1, 0, 0, 'x');
  } else {
    for (i = 0; i < Math.min(3, c.fans); i++) addFan(0.1, H / 2 - 1.2 - i * (fanR * 2 + 0.1), -D / 2 + 0.05, 'z');
    addFan(0.1, H / 2 - 1.2, D / 2 - 0.05, 'z');
  }
  // expansion slot brackets on the rear panel, from the bottom of the board upwards
  if (!horizontal) {
    var boardBottom = H / 2 - bw[1] * s - 0.3;
    for (i = 0; i < c.slots; i++) put(g, box(0.5, 0.15, 0.02, 0x9aa3ad, { metalness: 0.6 }), -W / 2 + 0.6, boardBottom + 0.3 + i * 0.2, D / 2 - 0.01);
  }
  return { group: g, dims: { W: W, H: H, D: D }, fans: fans };
};
})();

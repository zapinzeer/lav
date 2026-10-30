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
    'Mesto gde se ugrađuje procesor (CPU), „mozak” računara. Podnožje ima stotine kontakata (LGA: pinovi su na ploči, AM: pinovi su na procesoru) i metalni okvir sa polugom koji drži procesor. Podnožje određuje koji procesori mogu da se koriste. Pre ugradnje se skida plastični poklopac, a procesor se pridržava za ivice.',
    'The place where the processor (CPU), the "brain" of the computer, is installed. The socket has hundreds of contacts (LGA: the pins are on the board, PGA: the pins are on the processor) and a metal frame with a lever that holds the processor. The socket decides which processors can be used. Before installation the plastic cover is removed, and the processor is held by its edges.',
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
  p('vrm', 'VRM (napajanje procesora)', 'VRM (processor power)', 'Skup čipova, prigušnica i kondenzatora koji procesoru daje napajanje po njegovoj meri. Deo ploče koji se najviše zagreva, pa ima metalne hladnjake. Kvalitetniji VRM znači stabilniji rad procesora pod opterećenjem.', 'A group of chips, chokes and capacitors that gives the processor the power it needs. It is one of the hottest parts of the board, so it has metal heatsinks. A better VRM means steadier processor operation under load.', 'Jači procesor traži ploču sa boljim VRM-om i hladnjakom.', 'A more powerful processor needs a board with a better VRM and heatsink.'),
  p('atx24', '24-pinski konektor napajanja', '24-pin power connector', 'Glavni konektor za napajanje ploče. U njega se ukopčava veliki kabl iz napajanja i tako ploča i delovi na njoj dobijaju struju. Ima urez i štipaljku, pa ulazi samo u jednom položaju.', 'The main power connector of the board. The large cable from the power supply plugs into it so the board and its parts get power. It has a key and a latch, so it fits only one way.', 'Ukopčaj ga do kraja, dok ne škljocne štipaljka.', 'Push it in fully until the latch clicks.'),
  p('eps', 'EPS konektor (procesor)', 'EPS connector (processor)', 'Dodatni konektor samo za procesor, obično pored podnožja u gornjem levom uglu. Veće ploče imaju 8+4 pina. Ne meša se sa PCIe kablom grafičke kartice.', 'An extra connector for the processor only, usually next to the socket in the upper left corner. Larger boards have 8+4 pins. Do not mix it up with the PCIe cable of the graphics card.', 'Bez njega se računar ne pokreće.', 'Without it the computer does not start.'),
  p('io', 'Zadnja ploča (I/O)', 'Rear panel (I/O)',
    'Skup spoljnih priključaka: USB, mrežni (LAN) port, video izlazi (HDMI, DisplayPort), audio utičnice i drugo. Čelični I/O štitnik se montira u kućište oko njih.',
    'The set of external connectors: USB, network (LAN) port, video outputs (HDMI, DisplayPort), audio jacks and more. A steel I/O shield is mounted in the case around them.',
    'Video izlaz sa ploče radi samo ako procesor ima ugrađenu grafiku.', 'The video output from the board only works if the processor has integrated graphics.'),
  p('cmos', 'CMOS baterija', 'CMOS battery', 'Dugmasta baterija (tip CR2032) koja čuva sat i podešavanja BIOS-a kada je računar isključen. Ako se istroši, računar gubi datum, vreme i postavke.', 'A coin battery (type CR2032) that keeps the clock and the BIOS settings when the computer is off. If it runs out, the computer loses the date, time and settings.', 'Zamena je laka: izvadi staru i ubaci novu.', 'Replacing it is easy: take out the old one and put in a new one.'),
  p('bios', 'BIOS/UEFI čip', 'BIOS/UEFI chip',
    'Flash memorija sa osnovnim programom koji se pokreće prvi: proverava hardver (POST), omogućava podešavanja i zatim pokreće operativni sistem. Moderan naziv je UEFI. Ima i grafički meni sa mišem, izbor uređaja za pokretanje i profile memorije (XMP/EXPO).',
    'Flash memory holding the basic program that runs first: it checks the hardware (POST), allows settings and then starts the operating system. The modern name is UEFI. It has a graphical menu with mouse support, a boot-device choice and memory profiles (XMP/EXPO).',
    'Ažuriranje BIOS-a može da doda podršku za novije procesore, ali ne sme da se prekida.', 'Updating the BIOS can add support for newer processors, but it must not be interrupted.'),
  p('fan', 'Konektor za ventilator', 'Fan header', 'Četvoropinski konektor za ventilator procesora ili kućišta. Ploča očitava brzinu ventilatora i podešava je prema temperaturi, pa je računar tih dok je hladan.', 'A four-pin header for the CPU or case fan. The board reads the fan speed and adjusts it to the temperature, so the computer stays quiet while it is cool.', 'CPU_FAN je za hladnjak procesora i mora da bude zauzet.', 'CPU_FAN is for the processor cooler and must be in use.'),
  p('fpanel', 'Prednji panel (F_PANEL)', 'Front panel header',
    'Redovi pinova za dugme za uključivanje, reset, LED lampice i zvučnik kućišta. Ploča pali računar kad dugme dotakne dva pina.',
    'Rows of pins for the power button, reset, LEDs and the case speaker. The board turns the computer on when the button touches two pins.',
    'Raspored pinova je odštampan na ploči i u priručniku. Polaritet je bitan samo za LED.', 'The pin layout is printed on the board and in the manual. Polarity matters only for LEDs.'),
  p('usbh', 'Prednji USB i audio konektori', 'Front USB and audio headers',
    'Pinovi na koje se priključuju USB portovi i audio utičnice sa prednje strane kućišta. USB 3 ima širi konektor sa 19/20 pinova, a USB-C ima poseban konektor.',
    'Pins to which the USB ports and audio jacks on the front of the case are connected. USB 3 has a wider 19/20-pin connector, and USB-C has a dedicated connector.',
    'Konektori imaju ključ (urez) pa ne mogu da se okrenu naopako.', 'The connectors are keyed (notched) so they cannot be turned the wrong way round.'),
  p('m2b', 'Drugi M.2 slot sa hladnjakom', 'Second M.2 slot with heatsink',
    'Mnoge ploče imaju još jedan M.2 slot, često ispod metalnog hladnjaka. Brzi NVMe SSD se greje kad dugo radi, pa ga hladnjak štiti od usporavanja. Neki M.2 slotovi dele trake sa SATA portovima, pa popunjavanje jednog može da isključi drugi.',
    'Many boards have another M.2 slot, often under a metal heatsink. A fast NVMe SSD warms up when it works for a long time, and the heatsink keeps it from slowing down. Some M.2 slots share lanes with SATA ports, so filling one can switch the other off.',
    'Skini hladnjak, ubaci SSD, zavrni ga i vrati hladnjak. Skini foliju sa termalne podloge.', 'Remove the heatsink, insert the SSD, screw it down and put the heatsink back. Peel the film off the thermal pad.'),
  p('audio', 'Audio zona', 'Audio zone',
    'Odvojen deo ploče sa zvučnim čipom (kodek) i zlatnim kondenzatorima, često sa vidljivom linijom koja ga odvaja od ostatka ploče da bi zvuk bio čistiji. Odavde ide signal do audio utičnica na zadnjoj ploči i do prednje audio utičnice.',
    'A separate area of the board with the sound chip (codec) and golden capacitors, often with a visible line that separates it from the rest of the board for cleaner sound. From here the signal goes to the audio jacks on the rear panel and to the front audio jack.',
    'Ako je zvuk loš, prvo proveri da li je kabl prednjeg audija pravilno uglavljen.', 'If the sound is poor, first check that the front-audio cable is properly seated.'),
  p('debug', 'Dijagnostičke LED lampice', 'Debug LEDs',
    'Četiri male lampice (CPU, DRAM, VGA, BOOT) pokazuju u kojoj fazi pokretanja računar stoji. Ako ostane da svetli jedna od njih, znaš koji deo je problem: procesor, memorija, grafička ili uređaj za pokretanje.',
    'Four small lights (CPU, DRAM, VGA, BOOT) show at which stage of starting the computer is stuck. If one of them stays lit, you know which part to suspect: the processor, memory, graphics card or boot device.',
    'Na skupljim pločama umesto lampica postoji dvocifreni ekran sa kodovima.', 'More expensive boards have a two-digit code display instead of lights.'),
  p('rgb', 'RGB i ARGB konektori', 'RGB and ARGB headers',
    'Konektori za osvetljenje: obični RGB (4 pina) za trake u jednoj boji i adresabilni ARGB (3 pina) za trake i ventilatore čije se svako dioda boji posebno. Osvetljenje se kontroliše iz programa proizvođača ploče.',
    'Headers for lighting: plain RGB (4 pins) for single-colour strips and addressable ARGB (3 pins) for strips and fans where each LED has its own colour. The lighting is controlled from the board maker\'s software.',
    'RGB i ARGB konektori izgledaju slično, ali nisu zamenjivi: proveri oznaku u priručniku.', 'RGB and ARGB headers look alike but are not interchangeable: check the label in the manual.'),
  p('holes', 'Rupe za zavrtnje', 'Mounting holes',
    'Rupe (obično 9 kod ATX ploče) kroz koje se ploča zavrtnjima pričvršćuje za odstojnike u kućištu. Njihov raspored je standardizovan za svaki form-faktor.',
    'Holes (usually 9 on an ATX board) through which the board is screwed to the standoffs in the case. Their layout is standardised for each form factor.',
    'Odstojnik se stavlja samo tamo gde ploča ima rupu, inače može da ošteti ploču.', 'A standoff is placed only where the board has a hole, otherwise it can damage the board.')
];

api.PSU_PARTS = [
  p('body', 'Kućište napajanja', 'PSU housing', 'Metalni oklop koji drži sve unutrašnje delove napajanja i štiti ih od prašine i dodira. Napajanje je zatvorena kutija sa ventilatorom, ulazom za mrežni kabl i kablovima za komponente.', 'A metal shell that holds all the internal parts of the power supply and protects them from dust and touch. The power supply is a closed box with a fan, an inlet for the mains cable and cables for the components.', 'Nikad ne otvaraj napajanje: nema delova koje korisnik može da popravi.', 'Never open a power supply: it has no user-serviceable parts.'),
  p('label', 'Nalepnica sa podacima', 'Rating label', 'Na njoj piše ukupna snaga napajanja u vatima i oznaka kvaliteta (80 PLUS). Snaga govori koliko jakih komponenti napajanje može da prihvati.', 'It shows the total power rating of the supply in watts and the quality mark (80 PLUS). The rating tells how powerful a set of components the supply can handle.', 'Biraj napajanje sa rezervom, ne tačno onoliko koliko računar traži.', 'Choose a supply with some headroom, not exactly what the computer needs.'),
  p('fan', 'Ventilator', 'Fan', 'Hladi unutrašnje delove napajanja. Na malom opterećenju mnoga napajanja zaustavljaju ventilator, a brzina se menja prema temperaturi. Veći ventilator radi tiše.', 'It cools the internal parts of the supply. At a low load many power supplies stop the fan, and the speed changes with temperature. A larger fan runs more quietly.', 'Proveri uputstvo kućišta: ventilator napajanja može da gleda ka dnu ili ka unutrašnjosti.', 'Check the case manual: the fan of the supply may face the bottom or the inside.'),
  p('inlet', 'Ulaz za mrežni kabl i prekidač', 'Mains inlet and switch', 'Utičnica za kabl iz zidne utičnice i glavni prekidač. Prekidač potpuno isključuje napajanje.', 'The socket for the cable from the wall outlet and the main switch. The switch turns the power supply off completely.', 'Isključi prekidač i izvuci kabl pre bilo kakvog rada u kućištu.', 'Switch it off and pull the cable before any work inside the case.'),
  p('main24', '24-pinski ATX kabl', '24-pin ATX cable', 'Najveći kabl, ide na matičnu ploču. Žice u njemu su obojene po standardu, a ploča njime i pali napajanje. Neka napajanja imaju 20+4 pina: dodatna četiri se odvajaju za starije ploče.', 'The largest cable, it goes to the motherboard. The wires in it are colour-coded to a standard, and the board uses it to switch the supply on. Some supplies have 20+4 pins: the extra four detach for older boards.', 'Ukopčaj ga do kraja, dok ne škljocne štipaljka.', 'Push it in fully until the latch clicks.'),
  p('eps', '4+4 pin CPU kabl (EPS)', '4+4 pin CPU cable (EPS)', 'Poseban kabl za procesor. Deli se na dva dela po 4 pina, da bi mogao da se ukopča i u ploče sa 4-pinskim konektorom. Skuplje ploče traže dva EPS kabla.', 'A dedicated cable for the processor. It splits into two 4-pin halves so that it can also go into boards with a 4-pin connector. More expensive boards need two EPS cables.', 'Utakni ga u konektor pored procesora, ne u PCIe konektor grafičke.', 'Plug it into the connector next to the processor, not the PCIe connector of the graphics card.'),
  p('pcie', '6+2 pin PCIe kabl', '6+2 pin PCIe cable', 'Kabl za grafičku karticu. Ima 6-pinski i 8-pinski oblik, a jače kartice traže više konektora. Najnovije kartice koriste jedan 12-pinski konektor.', 'The cable for the graphics card. It comes in 6-pin and 8-pin forms, and more powerful cards need more connectors. The newest cards use a single 12-pin connector.', 'Za jaku karticu koristi dva odvojena kabla, a ne jedan kabl sa dva konektora.', 'For a power-hungry card use two separate cables, not one cable with two connectors.'),
  p('sata', 'SATA kabl za napajanje', 'SATA power cable', 'Plosnati konektor sa 15 pinova za HDD, SATA SSD i optičke uređaje. Na jednom kablu je obično 3 do 4 konektora.', 'A flat 15-pin connector for HDDs, SATA SSDs and optical drives. There are usually 3 to 4 connectors on one cable.', 'M.2 SSD ne koristi ovaj kabl: napaja se iz same ploče.', 'An M.2 SSD does not use this cable: it is powered from the board itself.'),
  p('modular', 'Modularna ploča sa priključcima', 'Modular connector panel',
    'Prednja strana modularnog napajanja ima utičnice u koje se ukopčavaju samo kablovi koji su ti potrebni. Utičnice su obeležene (CPU, PCIe, SATA/PERIPH, MB) i imaju različite oblike, pa ne možeš da ukopčaš pogrešan kabl. Tako je u kućištu manje kablova i više mesta za vazduh.',
    'The front of a modular power supply has sockets where you plug in only the cables you need. The sockets are labelled (CPU, PCIe, SATA/PERIPH, MB) and have different shapes, so you cannot plug in the wrong cable. This leaves fewer cables in the case and more room for air.',
    'Koristi samo kablove koji su došli uz to napajanje: kablovi drugih proizvođača nisu zamenjivi.', 'Use only the cables that came with that power supply: cables from other makers are not interchangeable.'),
  p('molex', 'Molex konektor', 'Molex connector', 'Stari 4-pinski konektor za ventilatore, kontrolere i starije uređaje. Danas se retko koristi, ali mnoga napajanja ga još imaju.', 'The old 4-pin connector for fans, controllers and older devices. It is rarely used today, but many power supplies still have it.', 'Ima zakošene ivice: ne može da se okrene naopako, ali traži dosta sile.', 'It has chamfered corners so it cannot be inserted the wrong way, but it takes quite some force.')
];

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

function srgb(c) { return new T.Color(c).convertSRGBToLinear(); }
function canvasTex(w, h, draw, color, repeat) {
  var c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  var t = new T.CanvasTexture(c);
  if (color) t.encoding = T.sRGBEncoding;
  if (repeat) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  t.anisotropy = 4;
  return t;
}
var seedN = 11;
function rn() { seedN = (seedN * 16807) % 2147483647; return seedN / 2147483647; }

var BRUSH = canvasTex(256, 256, function (x, w, h) {
  x.fillStyle = '#9a9a9a'; x.fillRect(0, 0, w, h);
  for (var i = 0; i < 900; i++) {
    var v = 110 + rn() * 90, y = rn() * h, l = 30 + rn() * 160, px = rn() * w;
    x.fillStyle = 'rgba(' + v + ',' + v + ',' + v + ',' + (0.1 + rn() * 0.3) + ')';
    x.fillRect(px, y, l, 1);
    x.fillRect(px - w, y, l, 1);
  }
}, false, [3, 3]);

var GRAIN = canvasTex(128, 128, function (x, w, h) {
  x.fillStyle = '#808080'; x.fillRect(0, 0, w, h);
  for (var i = 0; i < 2600; i++) { var v = 70 + rn() * 130; x.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; x.fillRect(rn() * w, rn() * h, 1.5, 1.5); }
}, false, [4, 4]);
function isGold(c) { return c === 0xd8b84c || c === 0xb7a35c || c === 0xc9a24a || c === 0xd8a648; }

V3.std = function (color, o) {
  o = o || {};
  var metal = o.metalness != null ? o.metalness : 0.0;
  var m = new T.MeshStandardMaterial({ color: srgb(color), roughness: o.roughness != null ? o.roughness : 0.5, metalness: metal, envMapIntensity: 1 });
  Object.keys(o).forEach(function (k) {
    if (k === 'metalness' || k === 'roughness') return;
    if (k === 'emissive') m.emissive.copy(srgb(o[k])); else m[k] = o[k];
  });
  if (metal >= 0.5 && !isGold(color)) {
    m.roughnessMap = BRUSH; m.bumpMap = BRUSH; m.bumpScale = 0.1; m.envMapIntensity = 0.7;
    m.roughness = Math.min(1, (o.roughness != null ? o.roughness : 0.4) + 0.25);
  } else if (metal >= 0.5) {
    m.roughness = o.roughness != null ? o.roughness : 0.28;
  } else if (o.roughMap !== false && !o.emissive && !o.transparent) {
    m.bumpMap = GRAIN; m.bumpScale = 0.04;
  }
  return m;
};
function mat(c, o) { return V3.std(c, o); }

var geoCache = {};
function boxGeo(w, h, d) {
  var key = w.toFixed(3) + ',' + h.toFixed(3) + ',' + d.toFixed(3);
  if (geoCache[key]) return geoCache[key];
  var m = Math.min(w, h, d), g;
  if (m < 0.03) g = new T.BoxGeometry(w, h, d);
  else {
    var bv = Math.min(0.02, m * 0.14);
    var sh = new T.Shape();
    sh.moveTo(-(w - 2 * bv) / 2, -(h - 2 * bv) / 2); sh.lineTo((w - 2 * bv) / 2, -(h - 2 * bv) / 2);
    sh.lineTo((w - 2 * bv) / 2, (h - 2 * bv) / 2); sh.lineTo(-(w - 2 * bv) / 2, (h - 2 * bv) / 2); sh.closePath();
    g = new T.ExtrudeGeometry(sh, { depth: d - 2 * bv, bevelEnabled: true, bevelThickness: bv, bevelSize: bv, bevelSegments: m < 0.1 ? 1 : 2, curveSegments: 1 });
    g.translate(0, 0, -(d - 2 * bv) / 2);
  }
  geoCache[key] = g;
  return g;
}
api.boxGeo = boxGeo;
function box(w, h, d, c, o) { return new T.Mesh(boxGeo(w, h, d), mat(c, o)); }
function cyl(r, h, c, o, seg) { return new T.Mesh(new T.CylinderGeometry(r, r, h, seg || 28), mat(c, o)); }
function put(g, m, x, y, z) { m.position.set(x, y, z); g.add(m); return m; }
var TOP = 0.02;

function studioEnv(renderer) {
  var sc = new T.Scene();
  var dome = new T.Mesh(new T.SphereGeometry(20, 32, 16), new T.MeshBasicMaterial({ side: T.BackSide, vertexColors: true }));
  var pos = dome.geometry.attributes.position, col = [];
  for (var i = 0; i < pos.count; i++) { var y = pos.getY(i) / 20, t = 0.5 + 0.5 * y; col.push(0.10 + 0.55 * t, 0.12 + 0.6 * t, 0.16 + 0.7 * t); }
  dome.geometry.setAttribute('color', new T.Float32BufferAttribute(col, 3));
  sc.add(dome);
  function panel(w, h, x, y, z, c, k) {
    var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(c).multiplyScalar(k), side: T.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); sc.add(m);
  }
  panel(14, 9, 8, 14, 8, 0xffffff, 6);
  panel(10, 6, -14, 6, 5, 0xcfe0ff, 3);
  panel(16, 3, 0, 4, -15, 0xffe9d0, 2.4);
  panel(18, 18, 0, -16, 0, 0x2a323c, 0.8);
  var pm = new T.PMREMGenerator(renderer);
  var rt = pm.fromScene(sc, 0.03);
  pm.dispose();
  return rt.texture;
}

var origStage = V3.createStage;
V3.createStage = function (fig, opt) {
  var st = origStage(fig, opt);
  if (!st) return st;
  var r = st.renderer, sc = st.scene;
  r.outputEncoding = T.sRGBEncoding;
  r.toneMapping = T.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.0;
  r.shadowMap.enabled = true;
  r.shadowMap.type = T.PCFSoftShadowMap;
  r.shadowMap.autoUpdate = false;
  sc.environment = studioEnv(r);
  sc.children.slice().forEach(function (o) {
    if (o.isHemisphereLight) o.intensity = 0.25;
    else if (o.isDirectionalLight && o.intensity > 0.5) {
      o.intensity = 1.6;
      o.castShadow = true;
      o.shadow.mapSize.set(2048, 2048);
      o.shadow.bias = -0.0004; o.shadow.normalBias = 0.02; o.shadow.radius = 4;
      var sh = o.shadow.camera;
      sh.left = -4; sh.right = 4; sh.top = 4; sh.bottom = -4; sh.near = 1; sh.far = 30;
      o.position.set(3.5, 8, 4.5);
    } else if (o.isDirectionalLight) o.intensity = 0.25;
  });

  var add = sc.add;
  sc.add = function (obj) {
    add.apply(sc, arguments);
    obj.traverse(function (m) { if (m.isMesh && m.material && !m.material.transparent) { m.castShadow = true; m.receiveShadow = true; } });
    r.shadowMap.needsUpdate = true;
  };
  var render = r.render, n = 0;
  r.render = function () { if (n++ % 12 === 0) r.shadowMap.needsUpdate = true; render.apply(r, arguments); };
  return st;
};

function traceTexture() {
  var W = 2048, H = 1640, k = W / 1024;
  function sizeCv() { var c = document.createElement('canvas'); c.width = W; c.height = H; return c; }
  var cc = sizeCv(), cb = sizeCv(), cr = sizeCv();
  var x = cc.getContext('2d'), xb = cb.getContext('2d'), xr = cr.getContext('2d');
  x.fillStyle = '#12362b'; x.fillRect(0, 0, W, H);
  xb.fillStyle = '#000'; xb.fillRect(0, 0, W, H);
  xr.fillStyle = '#5a5a5a'; xr.fillRect(0, 0, W, H);

  for (var f = 0; f < 5000; f++) { var gx = Math.random() * W, gy = Math.random() * H; x.fillStyle = 'rgba(255,255,255,.025)'; x.fillRect(gx, gy, 8, 1.5); }
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }

  for (var i = 0; i < 260; i++) {
    var px = rnd() * W, py = rnd() * H, bundle = 1 + Math.floor(rnd() * 4), dirx = rnd() < 0.5;
    for (var bn = 0; bn < bundle; bn++) {
      var ox = dirx ? 0 : bn * 9, oy = dirx ? bn * 9 : 0, qx = px + ox, qy = py + oy;
      x.beginPath(); xb.beginPath(); x.moveTo(qx, qy); xb.moveTo(qx, qy);
      for (var sg = 0; sg < 3; sg++) {
        var dx = dirx ? (rnd() < 0.5 ? 1 : -1) * (60 + rnd() * 220) : 0, dy = dirx ? 0 : (rnd() < 0.5 ? 1 : -1) * (60 + rnd() * 160);
        qx += dx; qy += dy; x.lineTo(qx, qy); xb.lineTo(qx, qy);
        if (rnd() < 0.6) { var d2 = 40 * (rnd() < 0.5 ? 1 : -1); qx += dirx ? d2 : 0; qy += dirx ? 0 : d2; x.lineTo(qx, qy); xb.lineTo(qx, qy); }
      }
      x.strokeStyle = 'rgba(70,150,110,.34)'; x.lineWidth = 5; x.stroke();
      xb.strokeStyle = '#fff'; xb.lineWidth = 5; xb.stroke();

      x.fillStyle = 'rgba(214,176,86,.9)'; x.beginPath(); x.arc(qx, qy, 6.5, 0, 6.3); x.fill();
      x.fillStyle = '#0a1a14'; x.beginPath(); x.arc(qx, qy, 2.2, 0, 6.3); x.fill();
      xr.fillStyle = '#222'; xr.beginPath(); xr.arc(qx, qy, 6.5, 0, 6.3); xr.fill();
    }
  }

  for (var q = 0; q < 700; q++) {
    var sx = 30 + rnd() * (W - 60), sy = 30 + rnd() * (H - 60), hz = rnd() < 0.5, kind = rnd();
    var ww = hz ? 16 : 9, hh = hz ? 9 : 16;
    if (kind < 0.55) { x.fillStyle = 'rgba(28,28,30,.95)'; x.fillRect(sx, sy, ww, hh); x.fillStyle = 'rgba(205,205,205,.8)'; x.fillRect(sx - 2, sy, 3.5, hh); x.fillRect(sx + ww - 1.5, sy, 3.5, hh); }
    else if (kind < 0.9) { x.fillStyle = 'rgba(176,146,98,.95)'; x.fillRect(sx, sy, ww, hh); x.fillStyle = 'rgba(210,210,210,.85)'; x.fillRect(sx - 2, sy, 3.5, hh); x.fillRect(sx + ww - 1.5, sy, 3.5, hh); }
    else { x.fillStyle = '#101113'; x.fillRect(sx, sy, 34, 34); x.fillStyle = 'rgba(200,200,200,.7)'; for (var pn = 0; pn < 6; pn++) { x.fillRect(sx - 3, sy + 3 + pn * 5, 3, 2); x.fillRect(sx + 34, sy + 3 + pn * 5, 3, 2); } }
    xb.fillStyle = '#ccc'; xb.fillRect(sx, sy, ww, hh);
    xr.fillStyle = '#999'; xr.fillRect(sx, sy, ww, hh);
  }
  function lab(txt, bx, bz, size, col) {
    var px = (bx + 1.525) / 3.05 * W, py = (bz + 1.22) / 2.44 * H;
    x.fillStyle = col || 'rgba(238,238,232,.88)';
    x.font = '600 ' + (size || 17) * k + 'px Arial';
    x.fillText(txt, px, py);
  }
  lab('CPU_FAN', 0.02, -1.08); lab('EATX12V', -0.78, -1.05); lab('ATX_PWR', 1.2, 0.2); lab('DIMM A1  B1  A2  B2', 0.18, -1.12, 14);
  lab('PCIEX16_1', -0.95, 0.25); lab('PCIEX16_2', -0.95, 0.76); lab('PCIEX1_1', -1.0, 0.54, 14); lab('M.2_1', -1.0, 0.08);
  lab('SATA 1-6', 1.08, 0.3, 15); lab('F_PANEL', 0.85, 1.12, 14); lab('CLR_CMOS', 0.22, 0.92, 13); lab('BAT', 0.0, 0.62, 14);
  lab('USB3_1', 1.22, -0.78, 14); lab('AUDIO', -1.4, 0.7, 14); lab('LGA / AM5', -0.7, -0.05, 14); lab('M.2_2', 0.1, 0.94, 13);
  lab('RGB', 0.72, -1.12, 14); lab('ARGB', 0.98, -1.12, 14); lab('LAV · ATX', -0.2, 1.0, 22); lab('REV 1.0', 1.0, -1.02, 12);
  lab('DEBUG', 1.2, 0.93, 11); lab('AUDIO CODEC', -1.4, 0.9, 10);
  x.strokeStyle = 'rgba(240,240,236,.45)'; x.lineWidth = 4;
  x.strokeRect(20, 20, W - 40, H - 40);
  var col = new T.CanvasTexture(cc); col.encoding = T.sRGBEncoding; col.anisotropy = 8;
  var bump = new T.CanvasTexture(cb); bump.anisotropy = 4;
  var rough = new T.CanvasTexture(cr); rough.anisotropy = 4;
  return { map: col, bump: bump, rough: rough };
}

api.buildBoard = function () {
  var root = new T.Group();
  var parts = {};
  var board = new T.Group();
  root.add(board);
  var pcb = box(3.05, 0.04, 2.44, 0x1c3d32);
  put(board, pcb, 0, 0, 0);
  var tt = traceTexture();
  var top = new T.Mesh(new T.PlaneGeometry(3.05, 2.44), new T.MeshPhysicalMaterial({ map: tt.map, bumpMap: tt.bump, bumpScale: 1.6, roughnessMap: tt.rough, roughness: 1, metalness: 0.0, clearcoat: 0.55, clearcoatRoughness: 0.25 }));
  top.receiveShadow = true;
  top.rotation.x = -Math.PI / 2;
  top.position.y = 0.0201;
  board.add(top);
  var floor = new T.Mesh(new T.PlaneGeometry(9, 9), new T.ShadowMaterial({ opacity: 0.4 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.03; floor.receiveShadow = true;
  root.add(floor);

  function part(id) {
    var g = new T.Group();
    g.userData.id = id;
    board.add(g);
    parts[id] = { id: id, group: g };
    return g;
  }

  var g = part('cpu');
  put(g, box(0.52, 0.05, 0.52, 0x1a1d22), -0.45, TOP + 0.025, -0.35);
  put(g, box(0.47, 0.02, 0.47, 0xaeb6bf, { metalness: 0.7, roughness: 0.35 }), -0.45, TOP + 0.06, -0.35);
  var cpu = box(0.38, 0.035, 0.38, 0xc9d0d8, { metalness: 0.75, roughness: 0.3 });
  put(g, cpu, -0.45, TOP + 0.085, -0.35);
  put(g, box(0.16, 0.036, 0.16, 0xaab3bd, { metalness: 0.7, roughness: 0.3 }), -0.45, TOP + 0.087, -0.35);
  put(g, cyl(0.012, 0.5, 0xd8dde3, { metalness: 0.8 }, 10), -0.45, TOP + 0.075, -0.07).rotation.z = Math.PI / 2;
  put(g, box(0.5, 0.012, 0.03, 0x848d97, { metalness: 0.7 }), -0.45, TOP + 0.052, -0.6);
  put(g, cyl(0.014, 0.1, 0xd8dde3, { metalness: 0.8 }, 10), -0.7, TOP + 0.058, -0.6).rotation.x = Math.PI / 2;
  parts.cpu.cpuMesh = cpu;

  g = part('ram');
  [0.3, 0.42, 0.54, 0.66].forEach(function (x, i) {
    put(g, box(0.075, 0.09, 1.36, i % 2 ? 0x15181d : 0x3a4048), x, TOP + 0.045, -0.42);
    put(g, box(0.075, 0.1, 0.05, 0xd8dde3), x, TOP + 0.05, 0.3);
    put(g, box(0.075, 0.1, 0.05, 0xd8dde3), x, TOP + 0.05, -1.14);
  });

  g = part('pcie16');
  put(g, box(0.89, 0.1, 0.08, DARK), -0.55, TOP + 0.05, 0.36);
  put(g, box(0.89, 0.1, 0.08, 0x2c3239), -0.55, TOP + 0.05, 0.86);
  put(g, box(0.09, 0.11, 0.095, 0xd8dde3), -0.06, TOP + 0.055, 0.36);
  put(g, box(0.8, 0.012, 0.02, 0xd8b84c, { metalness: 0.8 }), -0.55, TOP + 0.104, 0.36);
  put(g, box(0.8, 0.012, 0.02, 0xd8b84c, { metalness: 0.8 }), -0.55, TOP + 0.104, 0.86);
  put(g, box(0.9, 0.012, 0.1, 0x9aa3ad, { metalness: 0.7 }), -0.55, TOP + 0.108, 0.61);
  g = part('pcie1');
  put(g, box(0.28, 0.1, 0.08, DARK), -0.86, TOP + 0.05, 0.62);
  put(g, box(0.28, 0.1, 0.08, DARK), -0.86, TOP + 0.05, 1.08);

  g = part('m2');
  put(g, box(0.13, 0.05, 0.24, 0xd8b84c, { metalness: 0.8, roughness: 0.3 }), -0.96, TOP + 0.025, 0.14);
  put(g, cyl(0.035, 0.06, 0xd8b84c, { metalness: 0.8 }), -0.15, TOP + 0.03, 0.14);
  put(g, box(0.82, 0.008, 0.22, 0x2d3640, { transparent: true, opacity: 0.0 }), -0.55, TOP + 0.075, 0.14).visible = false;

  g = part('sata');
  for (var s = 0; s < 6; s++) put(g, box(0.2, 0.1, 0.075, 0x1d2228), 1.22, TOP + 0.05, 0.36 + s * 0.1);
  for (s = 0; s < 6; s++) put(g, box(0.05, 0.02, 0.04, 0xd8dde3, { metalness: 0.7 }), 1.3, TOP + 0.108, 0.36 + s * 0.1);

  g = part('chipset');
  put(g, box(0.4, 0.03, 0.4, 0x15171a), 0.62, TOP + 0.015, 0.52);
  put(g, box(0.34, 0.075, 0.34, 0x3f464e, { metalness: 0.6, roughness: 0.4 }), 0.62, TOP + 0.065, 0.52);
  for (s = -2; s <= 2; s++) put(g, box(0.34, 0.03, 0.025, 0x59626c, { metalness: 0.6 }), 0.62, TOP + 0.115, 0.52 + s * 0.065);

  g = part('vrm');
  put(g, box(1.22, 0.16, 0.16, 0x3f464e, { metalness: 0.6, roughness: 0.4 }), -0.5, TOP + 0.08, -0.86);
  for (s = 0; s < 13; s++) put(g, box(0.02, 0.05, 0.17, 0x59626c, { metalness: 0.6 }), -1.08 + s * 0.1, TOP + 0.185, -0.86);
  put(g, box(0.16, 0.16, 0.66, 0x3f464e, { metalness: 0.6, roughness: 0.4 }), -1.0, TOP + 0.08, -0.35);
  for (s = 0; s < 8; s++) put(g, box(0.17, 0.05, 0.02, 0x59626c, { metalness: 0.6 }), -1.0, TOP + 0.185, -0.66 + s * 0.09);
  for (s = 0; s < 7; s++) put(g, box(0.1, 0.1, 0.1, 0x2d3036), -0.78 + s * 0.12, TOP + 0.05, -0.7);
  for (s = 0; s < 8; s++) {
    put(g, cyl(0.045, 0.13, 0x2b2f36), -1.05 + s * 0.14, TOP + 0.065, -1.06);
    put(g, cyl(0.046, 0.01, 0xd8b84c, { metalness: 0.8 }), -1.05 + s * 0.14, TOP + 0.13, -1.06);
  }

  g = part('atx24');
  put(g, box(0.17, 0.19, 0.54, 0xd9d3c0), 1.42, TOP + 0.095, -0.2);
  for (s = 0; s < 12; s++) { put(g, box(0.05, 0.02, 0.025, 0xb7a35c, { metalness: 0.8 }), 1.38, TOP + 0.195, -0.43 + s * 0.042); put(g, box(0.05, 0.02, 0.025, 0xb7a35c, { metalness: 0.8 }), 1.46, TOP + 0.195, -0.43 + s * 0.042); }
  g = part('eps');
  put(g, box(0.33, 0.19, 0.17, 0xb9b3a2), -0.58, TOP + 0.095, -1.13);
  for (s = 0; s < 4; s++) { put(g, box(0.04, 0.02, 0.05, 0xb7a35c, { metalness: 0.8 }), -0.7 + s * 0.08, TOP + 0.195, -1.09); put(g, box(0.04, 0.02, 0.05, 0xb7a35c, { metalness: 0.8 }), -0.7 + s * 0.08, TOP + 0.195, -1.17); }

  g = part('io');
  put(g, box(0.34, 0.32, 1.0, 0x1a1e24, { roughness: 0.4 }), -1.35, TOP + 0.16, -0.58);
  for (var ig = 0; ig < 4; ig++) put(g, box(0.32, 0.12, 0.2, 0xb4bcc6, { metalness: 0.9, roughness: 0.3 }), -1.36, TOP + 0.28 + (ig % 2) * 0.0, -0.95 + ig * 0.25);
  put(g, box(0.32, 0.24, 0.36, 0x9aa3ad, { metalness: 0.6, roughness: 0.4 }), -1.35, TOP + 0.12, 0.12);
  [[-0.9, 0x2f6fe0], [-0.76, 0x2f6fe0], [-0.62, 0x2f6fe0], [-0.48, 0x15181d], [-0.34, 0x15181d]].forEach(function (u) { put(g, box(0.03, 0.09, 0.1, u[1]), -1.53, TOP + 0.13, u[0]); });
  put(g, box(0.03, 0.12, 0.16, 0x15181d), -1.53, TOP + 0.26, -0.8);
  put(g, box(0.03, 0.12, 0.16, 0x15181d), -1.53, TOP + 0.26, -0.55);
  put(g, box(0.03, 0.12, 0.14, 0x15181d), -1.53, TOP + 0.26, -0.3);
  [0x6fcf97, 0x6cc6ee, 0xf28b82, 0xffb468].forEach(function (c, i) { var j = cyl(0.045, 0.04, c, null, 14); j.rotation.z = Math.PI / 2; put(g, j, -1.52, TOP + 0.12, -0.02 + i * 0.1); });

  g = part('cmos');
  put(g, box(0.25, 0.045, 0.25, 0x1d2228), 0.08, TOP + 0.022, 0.78);
  put(g, cyl(0.1, 0.035, 0xc9d0d8, { metalness: 0.8, roughness: 0.3 }, 28), 0.08, TOP + 0.062, 0.78);

  g = part('bios');
  put(g, box(0.24, 0.03, 0.16, 0x15171a), 0.98, TOP + 0.015, 1.02);
  for (s = 0; s < 4; s++) { put(g, box(0.012, 0.012, 0.03, 0xc9d0d8, { metalness: 0.8 }), 0.9 + s * 0.05, TOP + 0.01, 0.92); put(g, box(0.012, 0.012, 0.03, 0xc9d0d8, { metalness: 0.8 }), 0.9 + s * 0.05, TOP + 0.01, 1.12); }

  g = part('fan');
  put(g, box(0.22, 0.1, 0.075, 0xe8e4d8), 0.12, TOP + 0.05, -1.16);
  put(g, box(0.22, 0.1, 0.075, 0xe8e4d8), 1.1, TOP + 0.05, 1.12);

  g = part('fpanel');
  put(g, box(0.32, 0.075, 0.09, 0x15181d), 1.0, TOP + 0.038, 1.17);
  for (s = 0; s < 9; s++) { put(g, box(0.014, 0.05, 0.014, 0xd8b84c, { metalness: 0.8 }), 0.87 + s * 0.035, TOP + 0.1, 1.15); put(g, box(0.014, 0.05, 0.014, 0xd8b84c, { metalness: 0.8 }), 0.87 + s * 0.035, TOP + 0.1, 1.19); }
  g = part('usbh');
  put(g, box(0.28, 0.1, 0.09, 0x15171a), 0.5, TOP + 0.05, 1.17);
  put(g, box(0.22, 0.075, 0.09, 0x15171a), -1.18, TOP + 0.038, 1.17);
  put(g, box(0.16, 0.1, 0.36, 0x15171a), 1.3, TOP + 0.05, -0.74);

  g = part('m2b');
  put(g, box(0.5, 0.03, 0.14, 0x15171a), 0.35, TOP + 0.015, 1.0);
  put(g, box(0.46, 0.05, 0.12, 0x3f464e, { metalness: 0.6, roughness: 0.4 }), 0.35, TOP + 0.055, 1.0);
  for (s = 0; s < 6; s++) put(g, box(0.02, 0.03, 0.12, 0x59626c, { metalness: 0.6 }), 0.17 + s * 0.07, TOP + 0.095, 1.0);

  g = part('audio');
  put(g, box(0.34, 0.012, 0.3, 0x0e2a22), -1.28, TOP + 0.006, 0.8);
  put(g, box(0.1, 0.03, 0.1, 0x15171a), -1.2, TOP + 0.027, 0.86);
  for (s = 0; s < 5; s++) { put(g, cyl(0.03, 0.06, 0xd8b84c, { metalness: 0.5 }, 14), -1.4 + s * 0.065, TOP + 0.04, 0.72); }
  put(g, box(0.28, 0.008, 0.012, 0xe8e4d8), -1.28, TOP + 0.014, 0.64);

  g = part('debug');
  put(g, box(0.07, 0.03, 0.34, 0x15171a), 1.38, TOP + 0.015, 1.0);
  [0xe85d3a, 0xf5f5f5, 0xf5c84c, 0x6fcf97].forEach(function (c, i) { put(g, box(0.045, 0.03, 0.045, c, { emissive: c, emissiveIntensity: 0.4 }), 1.38, TOP + 0.04, 0.88 + i * 0.08); });

  g = part('rgb');
  put(g, box(0.18, 0.09, 0.07, 0xe8e4d8), 0.76, TOP + 0.045, -1.15);
  put(g, box(0.14, 0.09, 0.07, 0x7a4ec2), 1.0, TOP + 0.045, -1.15);
  for (s = 0; s < 4; s++) put(g, box(0.012, 0.04, 0.012, 0xd8b84c, { metalness: 0.8 }), 0.7 + s * 0.04, TOP + 0.1, -1.15);
  for (s = 0; s < 3; s++) put(g, box(0.012, 0.04, 0.012, 0xd8b84c, { metalness: 0.8 }), 0.95 + s * 0.04, TOP + 0.1, -1.15);

  g = part('holes');
  [[-1.44, -1.15], [1.44, -1.15], [-1.44, 1.15], [1.44, 1.15], [-0.06, -1.15], [-0.06, 1.15], [-1.44, 0.2], [1.44, 0.2], [0.8, -0.65]].forEach(function (h) {
    var ring = new T.Mesh(new T.TorusGeometry(0.055, 0.016, 8, 24), mat(0xd8b84c, { metalness: 0.8, roughness: 0.3 }));
    ring.rotation.x = Math.PI / 2;
    put(g, ring, h[0], TOP + 0.012, h[1]);
  });

  var extras = new T.Group();
  board.add(extras);
  function fanRotor(r, blades, c) {
    var gr = new T.Group();
    for (var bi = 0; bi < blades; bi++) {
      var sh = new T.Shape();
      sh.moveTo(0.08 * r, 0); sh.bezierCurveTo(0.4 * r, -0.12 * r, 0.8 * r, -0.2 * r, 0.96 * r, 0.1 * r); sh.bezierCurveTo(0.7 * r, 0.3 * r, 0.35 * r, 0.22 * r, 0.08 * r, 0.06 * r);
      var bl = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.006, bevelEnabled: false }), mat(c, { roughness: 0.5 }));
      bl.rotation.z = bi / blades * Math.PI * 2;
      bl.rotation.x = 0.0;
      gr.add(bl);
    }
    var hub = new T.Mesh(new T.CylinderGeometry(0.2 * r, 0.2 * r, 0.03, 28), mat(0x15181d, { roughness: 0.4 }));
    hub.rotation.x = Math.PI / 2; gr.add(hub);
    return gr;
  }

  var cooler = new T.Group();
  put(cooler, box(0.42, 0.03, 0.42, 0xb06a3a, { metalness: 1, roughness: 0.25 }), -0.45, TOP + 0.13, -0.35);
  for (s = 0; s < 4; s++) put(cooler, cyl(0.022, 0.62, 0xb8703c, { metalness: 1, roughness: 0.22 }, 14), -0.58 + s * 0.09, TOP + 0.45, -0.35);
  for (s = 0; s < 26; s++) put(cooler, box(0.5, 0.01, 0.4, 0xc7ced6, { metalness: 0.9, roughness: 0.38 }), -0.45, TOP + 0.2 + s * 0.026, -0.35);
  put(cooler, box(0.5, 0.02, 0.4, 0x2a2f36, { roughness: 0.4 }), -0.45, TOP + 0.9, -0.35);
  var cfan = new T.Group();
  put(cfan, box(0.04, 0.62, 0.62, 0x1b1f25, { roughness: 0.5 }), 0, 0, 0);
  var cr = fanRotor(0.27, 9, 0x2a2f36); cr.rotation.y = Math.PI / 2; cr.position.x = 0.03; cfan.add(cr);
  cfan.position.set(-0.45 + 0.29, TOP + 0.55, -0.35);
  cooler.add(cfan);
  extras.add(cooler);

  var ramg = new T.Group();
  var ramLabel = canvasTex(256, 64, function (x, w, h) { x.fillStyle = '#16191e'; x.fillRect(0, 0, w, h); x.fillStyle = '#d9dde2'; x.font = '700 30px Arial'; x.fillText('LAV DDR5', 12, 28); x.font = '500 20px Arial'; x.fillStyle = '#9fb0c0'; x.fillText('6000 MT/s · CL30 · 16 GB', 12, 52); }, true);
  [0.42, 0.66].forEach(function (x) {
    put(ramg, box(0.016, 0.28, 1.33, 0x1c5a3a, { roughness: 0.4 }), x, TOP + 0.09 + 0.14, -0.42);
    put(ramg, box(0.012, 0.02, 1.2, 0xd8b84c, { metalness: 1, roughness: 0.25 }), x, TOP + 0.1, -0.42);
    put(ramg, box(0.03, 0.26, 1.3, 0x20252b, { metalness: 0.9, roughness: 0.35 }), x - 0.012, TOP + 0.09 + 0.16, -0.42);
    put(ramg, box(0.03, 0.26, 1.3, 0x20252b, { metalness: 0.9, roughness: 0.35 }), x + 0.012, TOP + 0.09 + 0.16, -0.42);
    put(ramg, box(0.052, 0.035, 1.3, 0x6cc6ee, { emissive: 0x2a94c0, emissiveIntensity: 0.9, roughMap: false }), x, TOP + 0.09 + 0.31, -0.42);
    var lb = new T.Mesh(new T.PlaneGeometry(0.62, 0.17), new T.MeshStandardMaterial({ map: ramLabel, roughness: 0.4, metalness: 0.2 }));
    lb.rotation.y = Math.PI / 2; lb.position.set(x + 0.0285, TOP + 0.09 + 0.17, -0.42); ramg.add(lb);
  });
  extras.add(ramg);

  var gpu = new T.Group();
  var shroud = canvasTex(1024, 256, function (x, w, h) {
    x.fillStyle = '#1b1e23'; x.fillRect(0, 0, w, h);
    for (var i = 0; i < 90; i++) { var v = 24 + rn() * 14; x.fillStyle = 'rgb(' + v + ',' + v + ',' + (v + 3) + ')'; x.fillRect(0, rn() * h, w, 1.5); }
    x.fillStyle = '#6cc6ee'; x.fillRect(0, h - 14, w, 5);
  }, true);
  var shMat = new T.MeshStandardMaterial({ map: shroud, roughness: 0.38, metalness: 0.25 });
  var gp = new T.Mesh(boxGeo(2.55, 1.05, 0.34), shMat);
  gp.position.set(-0.22, TOP + 0.58, 0.45); gpu.add(gp);
  put(gpu, box(2.5, 1.0, 0.03, 0x2b3037, { metalness: 0.8, roughness: 0.4 }), -0.22, TOP + 0.58, 0.26);
  [-0.85, 0.2, 0.9].forEach(function (x) {
    var rim = new T.Mesh(new T.TorusGeometry(0.32, 0.018, 10, 40), mat(0x0c0f13, { roughness: 0.4 })); rim.position.set(x - 0.1, TOP + 0.58, 0.625); gpu.add(rim);
    var fr = fanRotor(0.3, 11, 0x2a2e35); fr.position.set(x - 0.1, TOP + 0.58, 0.615); gpu.add(fr);
    var well = new T.Mesh(new T.CircleGeometry(0.31, 36), mat(0x08090c, { roughMap: false })); well.position.set(x - 0.1, TOP + 0.58, 0.6); gpu.add(well);
  });
  put(gpu, box(0.03, 1.1, 0.4, 0xc9d0d8, { metalness: 0.95, roughness: 0.3 }), -1.5, TOP + 0.58, 0.45);
  for (s = 0; s < 3; s++) put(gpu, box(0.04, 0.05, 0.16, 0x0c0f13), -1.52, TOP + 0.3 + s * 0.12, 0.5);
  put(gpu, box(0.34, 0.03, 0.12, 0xd8b84c, { metalness: 1, roughness: 0.28 }), -0.55, TOP - 0.01, 0.36);
  extras.add(gpu);

  var ssd = new T.Group();
  var ssdTex = canvasTex(512, 128, function (x, w, h) { x.fillStyle = '#1f2830'; x.fillRect(0, 0, w, h); x.fillStyle = '#e8edf2'; x.font = '800 30px Arial'; x.fillText('LAV NVMe 1TB', 12, 38); x.font = '500 18px Arial'; x.fillStyle = '#9fb0c0'; x.fillText('PCIe 4.0 x4 · M.2 2280', 12, 66); x.fillStyle = '#6cc6ee'; x.fillRect(0, 100, w, 4); }, true);
  put(ssd, box(0.8, 0.012, 0.22, 0x1c5a3a, { roughness: 0.4 }), -0.54, TOP + 0.085, 0.14);
  put(ssd, box(0.2, 0.014, 0.16, 0x121417), -0.8, TOP + 0.098, 0.14);
  put(ssd, box(0.14, 0.014, 0.14, 0x121417), -0.5, TOP + 0.098, 0.14);
  put(ssd, box(0.14, 0.014, 0.14, 0x121417), -0.25, TOP + 0.098, 0.14);
  var sl = new T.Mesh(new T.PlaneGeometry(0.4, 0.2), new T.MeshStandardMaterial({ map: ssdTex, roughness: 0.5, metalness: 0.3 }));
  sl.rotation.x = -Math.PI / 2; sl.position.set(-0.47, TOP + 0.108, 0.14); ssd.add(sl);
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

api.worldBox = function (obj, id) {
  var b = new T.Box3();
  obj.userData.parts[id].group.traverse(function (o) { if (o.isMesh) b.expandByObject(o); });
  return b;
};

api.attachUI = function (o) {

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
  ['MODULAR · ATX 3.0', 'ZERO RPM FAN MODE', '10-YEAR WARRANTY', 'MADE FOR LAV'].forEach(function (t, i) { x.fillText(t, 20, 136 + i * 30); });
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
  for (var vi = 0; vi < 9; vi++) put(g, box(1.1, 0.006, 0.03, 0x0c0f13), -0.1, 0.862, -0.45 + vi * 0.1);
  [[-0.7, -0.62], [0.7, -0.62], [-0.7, 0.62], [0.7, 0.62]].forEach(function (q) { put(g, cyl(0.03, 0.01, 0x9aa3ad, { metalness: 0.7 }, 12), q[0], 0.866, q[1]); });
  g = part('modular');
  put(g, box(1.46, 0.8, 0.03, 0x1b1f25, { metalness: 0.4 }), 0, 0.42, 0.715);
  [[-0.5, 0.62, 0.34], [-0.1, 0.62, 0.2], [0.2, 0.62, 0.2], [0.5, 0.62, 0.2], [-0.45, 0.3, 0.2], [-0.15, 0.3, 0.2], [0.15, 0.3, 0.2], [0.45, 0.3, 0.2]].forEach(function (q) {
    put(g, box(q[2], 0.16, 0.035, 0x0c0f13), q[0], q[1], 0.73);
    put(g, box(q[2] - 0.06, 0.06, 0.037, 0xd8b84c, { metalness: 0.8 }), q[0], q[1], 0.735);
  });
  g = part('inlet');
  put(g, box(0.5, 0.32, 0.06, 0x111418), 0.35, 0.5, -0.72);
  put(g, box(0.3, 0.14, 0.04, 0x1b1f25), 0.35, 0.5, -0.76);
  [-0.07, 0.07].forEach(function (dx) { put(g, box(0.03, 0.08, 0.05, 0xd8b84c, { metalness: 0.8 }), 0.35 + dx, 0.5, -0.8); });
  put(g, box(0.22, 0.14, 0.05, 0xc23a3a), -0.35, 0.62, -0.72);
  put(g, box(0.12, 0.1, 0.03, 0xe8e4d8), -0.35, 0.62, -0.75);

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
  put(root, box(4.6, 0.01, 3.6, 0x1b2836, { roughMap: false, roughness: 0.75 }), 0.2, -0.005, 1.5);
  Object.keys(parts).forEach(function (id) {
    var pt = parts[id];
    pt.meshes = [];
    pt.group.traverse(function (o) { if (o.isMesh) { o.userData.partId = id; pt.meshes.push(o); } });
  });
  root.userData.parts = parts;
  return root;
};

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

  var bw = { atx: [30.5, 24.4], matx: [24.4, 24.4], itx: [17, 17], eatx: [30.5, 33] }[boardKey] || [30.5, 24.4];
  var horizontal = kind === 'desk';
  var bd = box(horizontal ? bw[0] * s : 0.03, horizontal ? 0.03 : bw[1] * s, horizontal ? bw[1] * s : bw[0] * s, 0x1c3d32);
  if (horizontal) put(g, bd, -W / 2 + bw[0] * s / 2 + 0.2, -H / 2 + 0.25, 0);
  else put(g, bd, -W / 2 + 0.2, H / 2 - 0.3 - bw[1] * s / 2, D / 2 - bw[0] * s / 2 - 0.15);

  var psuS = kind === 'sff' ? [12.5, 6.3, 10] : [15, 8.6, 14];
  var psu = box(horizontal ? psuS[0] * s : psuS[1] * s, horizontal ? psuS[1] * s : psuS[1] * s, psuS[2] * s, 0x2b3139, { metalness: 0.4 });
  if (horizontal) put(g, psu, W / 2 - psuS[0] * s / 2 - 0.1, -H / 2 + psuS[1] * s / 2 + 0.02, D / 2 - psuS[2] * s / 2 - 0.1);
  else put(g, psu, 0, -H / 2 + psuS[1] * s / 2 + 0.02, D / 2 - psuS[2] * s / 2 - 0.1);

  if (!horizontal) for (var i = 0; i < Math.min(c.bays, 4); i++) put(g, box(W * 0.55, 0.12, 0.7, 0x3a424c), W * 0.12, -H / 2 + 1.2 + i * 0.16 + (kind === 'sff' ? 0.2 : 0), -D / 2 + 0.55);

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

  if (!horizontal) {
    var bx = -W / 2 + 0.2 + 0.2, by = H / 2 - 0.3 - bw[1] * s / 2, bz = D / 2 - bw[0] * s / 2 - 0.15;
    put(g, box(0.5, 0.5, 0.5, 0x3f464e, { metalness: 0.6, roughness: 0.4 }), bx + 0.25, by + bw[1] * s * 0.12, bz - bw[0] * s * 0.18);
    put(g, box(0.1, 0.55, 0.55, 0x2d3640), bx + 0.55, by + bw[1] * s * 0.12, bz - bw[0] * s * 0.18);
    [0.2, 0.3].forEach(function (dz) { put(g, box(0.06, 0.45, 0.03, 0x2a3a55, { metalness: 0.5 }), bx + 0.1, by + bw[1] * s * 0.18, bz - bw[0] * s * 0.05 - dz); });
    put(g, box(0.28, 0.12, bw[0] * s * 0.75, 0x1b1f25, { metalness: 0.3 }), bx + 0.16, by - bw[1] * s * 0.18, bz - bw[0] * s * 0.05);
    put(g, box(W * 0.92, 0.04, D * 0.35, 0x20262d, { metalness: 0.3 }), 0, -H / 2 + psuS[1] * s + 0.06, D * 0.1);
    if (c.fans > 1) addFan(0.1, H / 2 - 0.05, D / 2 - 1.2, 'y');
    for (i = 0; i < 2; i++) put(g, box(0.1, 0.05, 0.06, 0x15181d), -W / 2 + 0.6 + i * 0.2, H / 2 - 0.03, -D / 2 + 0.4);
    put(g, box(0.22, 0.14, 0.04, 0xc23a3a), 0, H / 2 - 0.03, -D / 2 + 0.2);
  }

  if (!horizontal) {
    var boardBottom = H / 2 - bw[1] * s - 0.3;
    for (i = 0; i < c.slots; i++) put(g, box(0.5, 0.15, 0.02, 0x9aa3ad, { metalness: 0.6 }), -W / 2 + 0.6, boardBottom + 0.3 + i * 0.2, D / 2 - 0.01);
  }
  return { group: g, dims: { W: W, H: H, D: D }, fans: fans };
};
})();

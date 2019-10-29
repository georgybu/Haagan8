let families = [
  {id: 0, jump: 1, floor: 3, hPosition: 2, parking: true, name: 'פנקר'},
  {id: 1, jump: 1, floor: 3, hPosition: 1, parking: false, name: 'איציקסון'},
  {id: 2, jump: 1, floor: 3, hPosition: 0, parking: true, name: 'שרביט'},
  {id: 3, jump: 1, floor: 2, hPosition: 2, parking: false, name: 'הרביץ'},
  {id: 4, jump: 1, floor: 2, hPosition: 1, parking: true, name: 'נחום'},
  {id: 5, jump: 1, floor: 2, hPosition: 0, parking: true, name: 'שציגובסקי'},
  {id: 6, jump: 1, floor: 1, hPosition: 2, parking: false, name: 'ברמן'},
  {id: 7, jump: 1, floor: 1, hPosition: 1, parking: false, name: 'סוויסה'},
  {id: 8, jump: 1, floor: 1, hPosition: 0, parking: true, name: 'זוקין'}
];
const familiesOriginal = JSON.parse(JSON.stringify(families));
const building = {firstFloor: 0, lastFloor: 10, hCount: 3, hNames: ['אחורית', 'קדמית קטנה', 'קדמית גדולה']};
const familiesTbl = document.querySelector('#familiesTbl tbody');
const buildingTbl = document.querySelector('#buildingTbl tbody');

const getNode = (tag, cb) => {
  const element = document.createElement(tag);
  cb(element);
  return element;
};
const getTextColumn = (text) => getNode('td', (e) => e.innerText = text);
const getNodeColumn = (node) => getNode('td', (e) => e.appendChild(node));
const getSelect = (labels, selectedIndex, cb) => {
  return getNode('select', (select) => {
    labels.forEach((label, index) => {
      select.appendChild(getNode('option', (e) => {
        e.value = e.text = label.toString();
        e.selected = index === selectedIndex ? 'selected' : '';
      }));
    });
    select.onchange = cb;
  });
};
const getInitialResidentStrategy = (floor, hPosition, families) => {
  const resident = families.find((f) => f.floor === floor && f.hPosition === hPosition);
  return {
    name: resident ? resident.name : 'יזם',
    type: resident ? 'family' : 'contractor'
  };
};
const getCalculatedResidentStrategy = (floor, hPosition, families) => {
  const residents = families.filter((f) => f.floor + f.jump === floor && f.hPosition === hPosition);
  console.log(residents, families, floor, hPosition);
  switch (true) {
    case residents.length === 0:
      return {name: 'יזם', type: 'contractor'};
    case residents.length === 1:
      return {name: residents[0].name, type: 'family'};
    default:
      residents.forEach((r, i) => i !== 0 ? r.jump++ : null);
      return {name: residents[0].name, type: 'family'};
  }
};
const renderFamiliesTable = (families) => {
  familiesTbl.innerHTML = '';
  families.forEach((family) => {
    familiesTbl.appendChild(getNode('tr', (row) => {
      row.appendChild(getTextColumn(family.name));
      row.appendChild(getTextColumn(family.parking ? '1' : '0'));
      row.appendChild(getNodeColumn(getSelect(family.parking ? [0, 1, 2] : [0, 1], family.jump, (e) => {
        family.jump = parseInt(e.target.value);
      })));
      row.appendChild(getTextColumn(family.floor));
      row.appendChild(getTextColumn(family.floor + family.jump));
      row.appendChild(getNodeColumn(getSelect(building.hNames, family.hPosition, (e) => {
        family.hPosition = building.hNames.indexOf(e.target.value);
      })));
    }));
  });
};
const renderBuildingTable = (families, getResidentCb) => {
  buildingTbl.innerHTML = '';
  for (let i = building.firstFloor; i < building.lastFloor; i++) {
    buildingTbl.prepend(getNode('tr', (row) => {
      row.appendChild(getTextColumn(`${i}`));
      for (let j = 0; j < building.hCount; j++) {
        const {name, type} = getResidentCb(i, j, families);
        const cell = getTextColumn(name);
        cell.className = type;
        row.appendChild(cell);
      }
      buildingTbl.appendChild(row);
    }));
  }
  document.querySelector('#buildingTbl').style.display = 'block';
};

function onShowInitTableClick() {
  families = JSON.parse(JSON.stringify(familiesOriginal));
  renderFamiliesTable(families);
  renderBuildingTable(families, getInitialResidentStrategy);
}
function onShowCalculatedTableClick() {
  renderBuildingTable(families, getCalculatedResidentStrategy);
}

renderFamiliesTable(families);

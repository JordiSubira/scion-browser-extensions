// Copyright 2021 ETH, Ovgu
'use strict';

let headline = document.getElementById('headline');
let toggleRunning = document.getElementById('toggleRunning');
let checkboxRunning = document.getElementById('checkboxRunning');

window.onload = function () {
  // Update host list in popup
  getStorageValue('list').then((hostSet) => {
    displayHostList(hostSet);
  });

  // Update host list in popup
  getStorageValue('isd_list').then((isdSet) => {
    displayISDList(isdSet);
  });

  // Update Forwarding badge depending on storage settings
  getStorageValue('forwarding_enabled').then(isForwardingEnabled => {
    if(isForwardingEnabled) {
      headline.innerText = "Active"
      headline.className = "inline-block rounded-full text-white bg-green-500 px-2 py-1 text-xs font-bold mr-3";
    } else {
      headline.innerText = "Inactive"
      headline.className = "inline-block rounded-full text-white bg-red-500 px-2 py-1 text-xs font-bold mr-3";
    }
  });

  // Load extension running value and remove other settings in case its not running
  getStorageValue('extension_running').then((val) => {
    toggleRunning.checked = val;
    document.getElementById('domains-container').hidden = !toggleRunning.checked;
    if(!val) {
      headline.innerText = "Inactive"
      headline.className = "inline-block rounded-full text-white bg-red-500 px-2 py-1 text-xs font-bold mr-3";
    }
  });
}

// Start/Stop global forwarding
function toggleExtensionRunning () {
  toggleRunning.checked = !toggleRunning.checked
  saveStorageValue('extension_running',toggleRunning.checked).then(() => {
    document.getElementById('domains-container').hidden = !toggleRunning.checked;
    document.getElementById('geofencing-container').hidden = !toggleRunning.checked;
  });

}
checkboxRunning.onclick = toggleExtensionRunning;



document.getElementById('button-write-hostname')
            .addEventListener('click', function() {
              let hostname = document.getElementById("input-hostname").value
              document.getElementById("input-hostname").value = ""
              addHost(hostname).then(hostSet=>{
                displayHostList([...hostSet]);
                return hostSet;
              })
            });


document.getElementById('button-delete-hostname')
            .addEventListener('click', function() {
              let hostCheckBoxes = document.getElementById("output").children
              let hostList = new Array()
              for (var i = 0; i < hostCheckBoxes.length; i++){
                if (hostCheckBoxes[i].getElementsByTagName("input")[0].checked){
                  let hostname = hostCheckBoxes[i].outerText;
                  hostList.push(hostname);
                }
              }
              deleteHosts(hostList).then(hostSet=>{
                displayHostList([...hostSet]);
                return hostSet;
              })
            });

function displayHostList(hostList){
  document.getElementById('output').innerHTML = ""
  for(var i=0; i < hostList.length; i++){
    document.getElementById('output')
          .innerHTML+= '<label class="inline-flex items-center mt-3"> <input type="checkbox" id=hostname-' + i + ' class="form-checkbox h-4 w-4 text-gray-600"><span class="ml-2 text-gray-700">'+  hostList[i] + '</span> </label>';
  }
}

function addHost(host){
  return getStorageValue('list').then(toSet).then(hostSet => {
    hostSet.add(host);
    saveStorageValue('list', [...hostSet]).then(() => {
      console.log('Added host: ' + host);
    })
    return hostSet;
  });
}

function deleteHosts(hostlist){
  return getStorageValue('list').then(toSet).then(hostSet => {
    for (const hostname of hostlist){
      hostSet.delete(hostname);
    }
    saveStorageValue('list', [...hostSet]).then(() => {
      console.log('Deleted hosts: ' + hostlist);
    })
    return hostSet;
  });
}

//Listeners for geofencing feature

document.getElementById('button-write-isd')
            .addEventListener('click', function() {
              let isd = document.getElementById("input-isd").value
              document.getElementById("input-isd").value = ""
              addISD(isd).then(isdSet=>{
                displayISDList([...isdSet]);
                return isdSet;
              })
            });


document.getElementById('button-delete-isd')
            .addEventListener('click', function() {
              let isdCheckboxes = document.getElementById("output-isd").children
              let isdList = new Array()
              for (var i = 0; i < isdCheckboxes.length; i++){
                if (isdCheckboxes[i].getElementsByTagName("input")[0].checked){
                  let isdname = isdCheckboxes[i].outerText;
                  isdList.push(isdname);
                }
              }
              deleteISD(isdList).then(isdSet=>{
                displayISDList([...isdSet]);
                return isdSet;
              })
            });

function displayISDList(isdList){
  document.getElementById('output-isd').innerHTML = ""
  for(var i=0; i < isdList.length; i++){
    document.getElementById('output-isd')
          .innerHTML+= '<label class="inline-flex items-center mt-3"> <input type="checkbox" id=isdname-' + i + ' class="form-checkbox h-4 w-4 text-gray-600"><span class="ml-2 text-gray-700">'+  isdList[i] + '</span> </label>';
  }
}

function addISD(isd){
  return getStorageValue('isd_list').then(toSet).then(isdSet => {
    isdSet.add(isd);
    saveStorageValue('isd_list', [...isdSet]).then(() => {
      console.log('Added isd: ' + isd);
    })
    return isdSet;
  });
}

function deleteISD(isdList){
  return getStorageValue('isd_list').then(toSet).then(isdSet => {
    for (const isd of isdList){
      isdSet.delete(isd);
    }
    saveStorageValue('isd_list', [...isdSet]).then(() => {
      console.log('Deleted isd: ' + isdList);
    })
    return isdSet;
  });
}
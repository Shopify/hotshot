export default {
  rmItemFromArr(item, arr){
    const idx = arr.indexOf(item);

    if (idx !== -1) {
      arr.splice(idx, 1);
    }
  }
};
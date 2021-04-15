const testpoints = [
    {"coordinates": [ 13.079463, 63.409133 ] },
    {"coordinates": [ 13.079472, 63.409131 ] },
    {"coordinates": [ 13.07948, 63.409116 ] },
    {"coordinates": [ 13.079481, 63.409103 ] },
    {"coordinates": [ 13.07947, 63.409075 ] },
    {"coordinates": [ 13.079467, 63.409066 ] },
    {"coordinates": [ 13.079426, 63.409038 ] },
    {"coordinates": [ 13.079406, 63.409027 ] },
    {"coordinates": [ 13.079331, 63.409013 ] },
    {"coordinates": [ 13.079299, 63.40901 ] },
    {"coordinates": [ 13.07924, 63.409015 ] },
    {"coordinates": [ 13.07917, 63.409018 ] },
    {"coordinates": [ 13.079059, 63.409028 ] },
    {"coordinates": [ 13.078943, 63.409039 ] },
    {"coordinates": [ 13.078851, 63.409043 ] },
    {"coordinates": [ 13.078803, 63.40906 ] },
    {"coordinates": [ 13.078795, 63.409052 ] },
    {"coordinates": [ 13.078758, 63.409053 ] },
    {"coordinates": [ 13.078722, 63.409059 ] },
    {"coordinates": [ 13.078661, 63.409063 ] },
    {"coordinates": [ 13.078602, 63.409074 ] },
    {"coordinates": [ 13.078433, 63.409099 ] },
    {"coordinates": [ 13.078349, 63.409114 ] },
    {"coordinates": [ 13.078267, 63.409142 ] },
    {"coordinates": [ 13.078166, 63.409156 ] },
    {"coordinates": [ 13.078063, 63.409182 ] },
    {"coordinates": [ 13.077963, 63.409192 ] },
    {"coordinates": [ 13.077874, 63.409207 ] },
    {"coordinates": [ 13.077778, 63.409208 ] },
    {"coordinates": [ 13.077685, 63.409211 ] },
    {"coordinates": [ 13.07757, 63.40922 ] },
    {"coordinates": [ 13.07747, 63.409216 ] },
    {"coordinates": [ 13.077342, 63.409207 ] },
    {"coordinates": [ 13.07725, 63.409171 ] },
    {"coordinates": [ 13.077123, 63.409127 ] },
    {"coordinates": [ 13.077001, 63.409015 ] },
    {"coordinates": [ 13.076956, 63.408919 ] },
    {"coordinates": [ 13.076911, 63.408864 ] },
    {"coordinates": [ 13.076726, 63.408776 ] },
    {"coordinates": [ 13.076657, 63.408702 ] },
    {"coordinates": [ 13.076668, 63.408655 ] },
    {"coordinates": [ 13.076604, 63.408519 ] },
    {"coordinates": [ 13.076784, 63.408389 ] },
    {"coordinates": [ 13.076967, 63.408307 ] },
    {"coordinates": [ 13.077079, 63.40828 ] },
    {"coordinates": [ 13.07718, 63.408176 ] },
    {"coordinates": [ 13.077246, 63.408082 ] },
    {"coordinates": [ 13.077495, 63.408024 ] },
    {"coordinates": [ 13.077746, 63.407986 ] },
    {"coordinates": [ 13.077906, 63.407902 ] },
    {"coordinates": [ 13.077963, 63.407801 ] },
    {"coordinates": [ 13.077871, 63.407715 ] },
    {"coordinates": [ 13.07801, 63.407629 ] },
    {"coordinates": [ 13.078063, 63.407538 ] },
    {"coordinates": [ 13.077929, 63.407472 ] },
    {"coordinates": [ 13.077811, 63.407443 ] },
    {"coordinates": [ 13.077843, 63.407343 ] },
    {"coordinates": [ 13.077976, 63.407269 ] },
    {"coordinates": [ 13.078114, 63.407222 ] },
    {"coordinates": [ 13.078137, 63.407142 ] },
    {"coordinates": [ 13.078055, 63.407067 ] },
    {"coordinates": [ 13.07816, 63.406966 ] },
    {"coordinates": [ 13.078339, 63.40688 ] },
    {"coordinates": [ 13.078358, 63.406768 ] },
    {"coordinates": [ 13.078447, 63.406665 ] },
    {"coordinates": [ 13.078623, 63.406586 ] },
    {"coordinates": [ 13.078655, 63.406473 ] },
    {"coordinates": [ 13.078854, 63.406372 ] },
    {"coordinates": [ 13.079104, 63.406329 ] },
    {"coordinates": [ 13.079182, 63.406218 ] },
    {"coordinates": [ 13.079115, 63.406131 ] },
    {"coordinates": [ 13.079108, 63.406051 ] },
    {"coordinates": [ 13.079263, 63.405962 ] },
    {"coordinates": [ 13.079357, 63.405965 ] },
    {"coordinates": [ 13.079493, 63.405903 ] },
    {"coordinates": [ 13.079485, 63.405808 ] },
    {"coordinates": [ 13.079317, 63.405732 ] },
    {"coordinates": [ 13.079272, 63.405666 ] },
    {"coordinates": [ 13.07941, 63.405624 ] },
    {"coordinates": [ 13.079524, 63.405615 ] },
    {"coordinates": [ 13.079584, 63.405622 ] },
    {"coordinates": [ 13.079606, 63.405642 ] },
    {"coordinates": [ 13.079604, 63.405641 ] },
    {"coordinates": [ 13.079608, 63.405639 ] },
    {"coordinates": [ 13.079586, 63.405633 ] },
    {"coordinates": [ 13.079589, 63.405634 ] },
    {"coordinates": [ 13.079586, 63.405626 ] },
    {"coordinates": [ 13.079581, 63.405619 ] },
    {"coordinates": [ 13.079584, 63.405613 ] },
    {"coordinates": [ 13.079584, 63.405615 ] },
    {"coordinates": [ 13.079587, 63.405602 ] },
    {"coordinates": [ 13.079604, 63.405597 ] },
    {"coordinates": [ 13.079635, 63.405596 ] },
    {"coordinates": [ 13.079663, 63.405596 ] },
    {"coordinates": [ 13.079691, 63.405592 ] },
    {"coordinates": [ 13.079707, 63.405598 ] },
    {"coordinates": [ 13.079711, 63.40559 ] },
    {"coordinates": [ 13.079741, 63.405571 ] },
    {"coordinates": [ 13.079743, 63.405524 ] },
    {"coordinates": [ 13.079656, 63.405475 ] },
    { "coordinates": [ 13.079583, 63.405433 ] },
    { "coordinates": [ 13.079575, 63.405337 ] },
    { "coordinates": [ 13.079531, 63.405256 ] },
    { "coordinates": [ 13.079499, 63.405188 ] },
    { "coordinates": [ 13.079429, 63.4051 ] },
    { "coordinates": [ 13.07931, 63.405025 ] },
    { "coordinates": [ 13.079074, 63.404957 ] },
    { "coordinates": [ 13.079099, 63.404845 ] },
    { "coordinates": [ 13.079166, 63.404732 ] },
    { "coordinates": [ 13.079238, 63.404598 ] },
    { "coordinates": [ 13.079299, 63.404462 ] },
    { "coordinates": [ 13.079236, 63.404352 ] },
    { "coordinates": [ 13.079136, 63.404217 ] },
    { "coordinates": [ 13.079275, 63.404089 ] },
    { "coordinates": [ 13.079459, 63.40399 ] },
    { "coordinates": [ 13.079385, 63.403884 ] },
    { "coordinates": [ 13.07945, 63.40378 ] },
    { "coordinates": [ 13.079465, 63.403673 ] },
    { "coordinates": [ 13.079479, 63.403563 ] },
    { "coordinates": [ 13.079616, 63.403449 ] },
    { "coordinates": [ 13.079614, 63.403318 ] },
    { "coordinates": [ 13.079327, 63.403236 ] },
    { "coordinates": [ 13.079329, 63.403118 ] },
    { "coordinates": [ 13.07954, 63.403012 ] },
    { "coordinates": [ 13.079723, 63.40291 ] },
    { "coordinates": [ 13.079623, 63.402802 ] },
    { "coordinates": [ 13.079418, 63.402715 ] },
    { "coordinates": [ 13.079383, 63.402625 ] },
    { "coordinates": [ 13.079437, 63.402567 ] },
    { "coordinates": [ 13.079498, 63.402559 ] },
    { "coordinates": [ 13.079508, 63.402561 ] },
    { "coordinates": [ 13.07951, 63.402569 ] },
    { "coordinates": [ 13.0795, 63.402568 ] },
    { "coordinates": [ 13.079491, 63.402567 ] },
    { "coordinates": [ 13.079492, 63.402565 ] },
    { "coordinates": [ 13.079494, 63.40256 ] },
    { "coordinates": [ 13.079497, 63.402562 ] },
    { "coordinates": [ 13.079496, 63.402561 ] },
    { "coordinates": [ 13.079495, 63.40256 ] },
    { "coordinates": [ 13.079493, 63.402558 ] },
    { "coordinates": [ 13.079498, 63.402557 ] },
    { "coordinates": [ 13.079484, 63.402554 ] }
];

export default testpoints; 
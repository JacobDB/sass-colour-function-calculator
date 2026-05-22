angular.module('scfc', [])
  .controller('ScfcController', ['$scope', function($scope) {
    $scope.scfc = {
      colorA: '#BADA55',
      colorB: '#B0BCA7',
      colorDiff: function(a, b) {
        var aHsl = tinycolor(a).toHsl(),
            bHsl = tinycolor(b).toHsl(),

            // Modern Sass requires explicit percentage signs or degrees,
            // so we calculate the raw differences here.
            sat = (bHsl.s - aHsl.s) * 100, // Positive means increase, negative means decrease
            lig = (bHsl.l - aHsl.l) * 100,
            hue = bHsl.h - aHsl.h;

        // Handle hue wrapping (optional, but keeps numbers cleaner)
        if (hue > 180) hue -= 360;
        if (hue < -180) hue += 360;

        return {
          baseColor: '#' + tinycolor(a).toHex(),
          hue: hue.toFixed(2),
          sat: sat.toFixed(2),
          lig: lig.toFixed(2)
        };
      },
      adjustmentStringConstuctor: function(diff) {
        // Build the modern color.adjust() arguments dynamically
        var args = [diff.baseColor];

        if (parseFloat(diff.hue) !== 0) {
          args.push('$hue: ' + diff.hue + 'deg');
        }
        if (parseFloat(diff.sat) !== 0) {
          args.push('$saturation: ' + diff.sat + '%');
        }
        if (parseFloat(diff.lig) !== 0) {
          args.push('$lightness: ' + diff.lig + '%');
        }

        // If no changes are needed, just return the base color
        if (args.length === 1) {
          return diff.baseColor;
        }

        // Join them all together inside color.adjust()
        return 'color.adjust(' + args.join(', ') + ')';
      },
      adjustmentString: function() {
        if ( !( tinycolor($scope.scfc.colorA).isValid() && tinycolor($scope.scfc.colorB).isValid() ) )
          return 'Please enter two valid colours';

        var adjustments = $scope.scfc.colorDiff($scope.scfc.colorA, $scope.scfc.colorB);
        return $scope.scfc.adjustmentStringConstuctor(adjustments);
      }
    };
  }]);

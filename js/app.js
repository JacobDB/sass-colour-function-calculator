angular.module('scfc', [])
  .controller('ScfcController', ['$scope', function($scope) {
    $scope.scfc = {
      colorA: '#BADA55',
      colorB: '#B0BCA7',
      customBase: '#4A90E2', // Default third base color

      reverseColors: function() {
        var temp = $scope.scfc.colorA;
        $scope.scfc.colorA = $scope.scfc.colorB;
        $scope.scfc.colorB = temp;
      },

      colorDiff: function(a, b) {
        var aHsl = tinycolor(a).toHsl(),
            bHsl = tinycolor(b).toHsl(),

        // Calculate differences (-100 to 100 range)
        sat = (bHsl.s - aHsl.s) * 100,
        lig = (bHsl.l - aHsl.l) * 100,
        hue = bHsl.h - aHsl.h;

        if (hue > 180) hue -= 360;
        if (hue < -180) hue += 360;

        return {
          baseColor: '#' + tinycolor(a).toHex(),
          hue: parseFloat(hue.toFixed(2)),
          sat: parseFloat(sat.toFixed(2)),
          lig: parseFloat(lig.toFixed(2))
        };
      },

      adjustmentStringConstuctor: function(diff) {
        var args = [diff.baseColor];
        if (diff.hue !== 0) args.push('$hue: ' + diff.hue + 'deg');
        if (diff.sat !== 0) args.push('$saturation: ' + diff.sat + '%');
        if (diff.lig !== 0) args.push('$lightness: ' + diff.lig + '%');

        if (args.length === 1) return diff.baseColor;
        return 'color.adjust(' + args.join(', ') + ')';
      },

      adjustmentString: function() {
        if ( !( tinycolor($scope.scfc.colorA).isValid() && tinycolor($scope.scfc.colorB).isValid() ) )
          return 'Please enter two valid colours';

        var adjustments = $scope.scfc.colorDiff($scope.scfc.colorA, $scope.scfc.colorB);
        return $scope.scfc.adjustmentStringConstuctor(adjustments);
      },

      // --- NEW EVALUATION FUNCTION ---
      getEvaluatedHex: function() {
        if (!(tinycolor($scope.scfc.colorA).isValid() &&
              tinycolor($scope.scfc.colorB).isValid() &&
              tinycolor($scope.scfc.customBase).isValid())) {
          return '—';
        }

        // Get the active adjustments
        var diff = $scope.scfc.colorDiff($scope.scfc.colorA, $scope.scfc.colorB);

        // Grab the HSL object of the new custom base color
        var baseHsl = tinycolor($scope.scfc.customBase).toHsl();

        // 1. Shift Hue (and keep it wrapped inside 0-360 degrees)
        var newHue = (baseHsl.h + diff.hue) % 360;
        if (newHue < 0) newHue += 360;

        // 2. Shift Saturation & Lightness (clamp securely between 0% and 100%)
        var newSat = Math.min(100, Math.max(0, (baseHsl.s * 100) + diff.sat)) / 100;
        var newLig = Math.min(100, Math.max(0, (baseHsl.l * 100) + diff.lig)) / 100;

        // Reconstruct the new color using tinycolor HSL input
        var finalColor = tinycolor({ h: newHue, s: newSat, l: newLig });

        return finalColor.toHexString().toUpperCase();
      }
    };
  }]);

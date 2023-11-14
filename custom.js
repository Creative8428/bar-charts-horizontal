"use strict";
document.addEventListener("DOMContentLoaded", () => {
  am5.ready(function () {
    // Create root element
    const root = am5.Root.new("chartdiv");

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

    const translations = {
      "Category 1": {
        "en-US": "Category 1",
        "fr-FR": "Catégorie 1",
      },
      "Category 2": {
        "en-US": "Category 2",
        "fr-FR": "Catégorie 2",
      },
      "Category 3": {
        "en-US": "Category 3",
        "fr-FR": "Catégorie 3",
      },
      "Category 4": {
        "en-US": "Category 4",
        "fr-FR": "Catégorie 4",
      },
      "Category 5": {
        "en-US": "Category 5",
        "fr-FR": "Catégorie 5",
      },
      "Category 6": {
        "en-US": "Category 6",
        "fr-FR": "Catégorie 6",
      },
      en: {
        figureText: "Figure 1:\n Categories",
        sourceText: "Source: Specify",
        ariaLabel: "Image 1: Categories",
      },
      fr: {
        figureText: "Figure 1:\n Catégories",
        sourceText: "Source: Specify",
        ariaLabel: "Image 1: Catégories",
      },
    };
    // Data
    const data = [
      {
        "domain": "Category 1",
        "2020": 13,
        "2021": 15,
        "2022": 41,
        "2023": 3,
      },
      {
        "domain": "Category 2",
        "2020": 8,
        "2021": 5,
        "2022": 11,
        "2023": 1,
      },
      {
        "domain": "Category 3",
        "2020": 17,
        "2021": 52,
        "2022": 51,
        "2023": 9,
      },
      {
        "domain": "Category 4",
        "2020": 18,
        "2021": 27,
        "2022": 31,
        "2023": 3,
      },
      {
        "domain": "Category 5",
        "2020": 3,
        "2021": 19,
        "2022": 28,
        "2023": 2,
      },
      {
        "domain": "Category 6",
        "2021": 4,
        "2022": 14,
        "2023": 1,
      },
    ];

    const lang = document.documentElement.lang;
    updateDataLanguage(lang);

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
        focusable: true,
        isMeasured: true,
        ariaLabel: translate(lang, "ariaLabel"),
      })
    );

    function createLabel(root, config) {
      return am5.Label.new(root, {
        fontSize: 16,
        fontFamily: "Open Sans, sans-serif",
        ...config,
      });
    }

    function translate(language, key) {
      let langCode = language.split("-")[0];

      if (translations[langCode]) {
        return translations[langCode][key];
      }

      return translations.en[key];
    }

    chart.children.unshift(
      createLabel(root, {
        text: translate(lang, "figureText"),
        textAlign: "center",
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 0,
        paddingBottom: 20,
      })
    );

    chart.children.unshift(
      createLabel(root, {
        text: translate(lang, "sourceText"),
        y: am5.percent(100),
        centerX: am5.percent(0),
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 50,
      })
    );

    // Create axes
    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "domain",
        renderer: am5xy.AxisRendererY.new(root, {
          inversed: true,
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
        }),
      })
    );

    const yAxisRenderer = yAxis.get("renderer");
    yAxisRenderer.labels.template.setAll({
      rotation: 0,
      valign: "middle",
      align: "right",
      multiLine: true,
      maxWidth: 120,
    });

    yAxis.data.setAll(data);

    function updateDataLanguage(pageLanguage) {
      data.forEach(function (item) {
        if (translations[item.domain].hasOwnProperty(pageLanguage)) {
          item.domain = translations[item.domain][pageLanguage];
        }
      });
    }

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1,
        }),
        min: 0,
      })
    );
    // Add series
    function createSeries(field, name, color) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueXField: field,
          categoryYField: "domain",
          sequencedInterpolation: true,
          fill: color,
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "[bold]{name}[/]\n{categoryY}: {valueX}",
          }),
        })
      );

      series.columns.template.setAll({
        height: am5.p100,
        strokeOpacity: 0,
        focusable: true,
        // hoverOnFocus: true,
        tooltipText: "[bold]{name}[/]\n{categoryY}: {valueX}",
        ariaLabel: "{name}. {categoryY} {valueX}",
        role: "figure",
        focusableGroup: "Figure #1",
        tooltipY: 0,
      });

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationX: 1,
          locationY: 0.5,
          sprite: am5.Label.new(root, {
            centerX: am5.p100,
            centerY: am5.p50,
            text: "{name}",
            fill: am5.color(0xffffff),
            populateText: true,
          }),
        });
      });

      series.data.setAll(data);
      series.appear();

      return series;
    }

    createSeries("2023", "2023", am5.color("#286470"));
    createSeries("2022", "2022", am5.color("#52bdeb"));
    createSeries("2021", "2021", am5.color("#f67058"));
    createSeries("2020", "2020", am5.color("#8c6857"));

    // Add legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    legend.data.setAll(chart.series.values);
    // Add cursor
    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "zoomY",
      })
    );
    cursor.lineY.set("forceHidden", true);
    cursor.lineX.set("forceHidden", true);

    chart.appear(1000, 100);

    // Export menu for PNG, CSV, etc.
    const exporting = am5plugins_exporting.Exporting.new(root, {
      menu: am5plugins_exporting.ExportingMenu.new(root, {}),
      dataSource: data,
    });

    exporting.events.on("dataprocessed", function (ev) {
      for (let i = 0; i < ev.data.length; i++) {
        ev.data[i].sum = ev.data[i].value + ev.data[i].value2;
      }
    });

    exporting.get("menu").set("items", [
      {
        type: "format",
        format: "print",
        label: "Print",
      },
      {
        type: "format",
        format: "csv",
        label: "Export CSV",
      },
      {
        type: "format",
        format: "png",
        label: "Export PNG",
      },
    ]);
  });
});

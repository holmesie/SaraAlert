import React from 'react';
import _ from 'lodash';
import reportError from '../../util/ReportError';
import { PropTypes } from 'prop-types';
import { stateOptions, customTerritories } from '../../data';
import * as am4maps from '@amcharts/amcharts4/maps';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import usaLow from '@amcharts/amcharts4-geodata/usaLow.js';

// import maLow from '@amcharts/amcharts4-geodata/region/usa/maLow';

am4core.useTheme(am4themes_animated);

class CountyLevelMaps extends React.Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.territoryChart = null;
    this.usaSeries = null;
    this.usaPolygon = null;
    this.jurisdictionSeries = null;
    this.jurisdictionPolygon = null;
    this.territorySeries = null;
    this.territoryPolygon = null;
    this.heatLegend = null;
    this.territoryHeatLegend = null;
    // If multiple instances of the CLM Component exist on a page, amcharts4 cannnot find the correct
    // instance to mount the chart at. Therefore we generate custom string for each instance
    this.customID = this.makeid(10).substring(0, 6);
    this.state = {
      showTerritory: false,
    };
  }

  makeid = length => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; ++i) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  componentDidMount = () => {
    this.chart = am4core.create(`chartdiv-${this.customID}`, am4maps.MapChart);
    this.chart.projection = new am4maps.projections.AlbersUsa();
    this.chart.seriesContainer.draggable = false;
    this.chart.seriesContainer.resizable = false;
    this.chart.seriesContainer.wheelable = false;
    this.chart.maxZoomLevel = 1;
    this.heatLegend = this.chart.createChild(am4maps.HeatLegend);

    this.usaSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
    this.usaSeries.useGeodata = true;
    this.usaSeries.geodata = usaLow;

    this.usaPolygon = this.usaSeries.mapPolygons.template;
    this.usaPolygon.tooltipText = '{name}: {value}';
    this.usaPolygon.nonScalingStroke = true;
    this.usaPolygon.fill = am4core.color('#3e6887');
    this.usaPolygon.propertyFields.fill = 'color';

    this.usaSeries.heatRules.push({
      property: 'fill',
      target: this.usaSeries.mapPolygons.template,
      min: am4core.color('#E89005').lighten(0.5),
      max: am4core.color('#A62639').brighten(0.5),
    });

    this.usaPolygon.events.on('hit', ev => {
      this.props.handleJurisdictionChange(ev);
    });

    this.jurisdictionSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
    this.jurisdictionSeries.useGeodata = true;
    this.jurisdictionSeries.hide();

    // this.jurisdictionSeries.events.onAll(ev => {
    // console.log('Remove this at some point, but its interesting to see all events', ev);
    // });
    // this.jurisdictionSeries.geodataSource.events.on('done', () => {
    //   console.log("done fires...?")
    //   this.usaSeries.hide();
    //   this.jurisdictionSeries.show();
    //   this.updateJurisdictionData();
    // });

    this.jurisdictionSeries.geodataSource.events.on('error', ev => {
      reportError(ev);
    });

    this.jurisdictionPolygon = this.jurisdictionSeries.mapPolygons.template;
    this.jurisdictionPolygon.tooltipText = '{name} : {value}';
    console.log(`this.jurisdictionPolygon`);
    console.log(this.jurisdictionPolygon);
    // this.mapImageSeries.tooltip
    // this.jurisdictionPolygon.adapter.add("tooltipText", ev => {
    // this.jurisdictionSeries.adapter.add("tooltipText", ev => {
    // var text = "[bold]{dateX}[/]\n"
    // chart.series.each(function(item) {
    // text += "[" + item.stroke.hex + "]●[/] " + item.name + ": {" + item.dataFields.valueY + "}\n";
    // });÷
    // return '{name} : {value}'
    // return text;
    // });
    // Set up tooltip
    // series.adapter.add("tooltipText", function(ev) {
    //   var text = "[bold]{dateX}[/]\n"
    //   chart.series.each(function(item) {
    //     text += "[" + item.stroke.hex + "]●[/] " + item.name + ": {" + item.dataFields.valueY + "}\n";
    //   });
    //   return text;
    // });
    // this.jurisdictionSeries.calculateVisualCenter = true;
    // this.jurisdictionTemplate.tooltipPosition = "fixed";
    // series.tooltip.label.adapter.add("text", function(text, target) {
    //   if (target.dataItem && target.dataItem.valueY == 0) {
    //     return "Sara Alert Not in Use";
    //   }
    //   else {
    //     return text;
    //   }
    // });
    this.jurisdictionPolygon.nonScalingStroke = true;
    this.jurisdictionPolygon.fill = am4core.color('#f06a6d');
    this.jurisdictionSeries.heatRules.push({
      property: 'fill',
      target: this.jurisdictionSeries.mapPolygons.template,
      min: am4core.color('#E89005').lighten(0.5),
      max: am4core.color('#A62639').brighten(0.5),
    });

    this.territoryChart = am4core.create(`territorydiv-${this.customID}`, am4maps.MapChart);
    this.territoryChart.projection = new am4maps.projections.Mercator();
    this.territoryChart.seriesContainer.draggable = false;
    this.territoryChart.seriesContainer.resizable = false;
    this.territoryChart.seriesContainer.wheelable = false;
    this.territoryChart.maxZoomLevel = 1;
    this.territoryHeatLegend = this.territoryChart.createChild(am4maps.HeatLegend);

    this.territorySeries = this.territoryChart.series.push(new am4maps.MapPolygonSeries());
    this.territorySeries.useGeodata = true;
    // this.territorySeries.geodata = usaLow;

    this.territoryPolygon = this.territorySeries.mapPolygons.template;
    this.territoryPolygon.tooltipText = '{name}: {value}';
    this.territoryPolygon.nonScalingStroke = true;
    this.territoryPolygon.fill = am4core.color('#3e6887');
    this.territoryPolygon.propertyFields.fill = 'color';

    this.territorySeries.heatRules.push({
      property: 'fill',
      target: this.territorySeries.mapPolygons.template,
      min: am4core.color('#E89005').lighten(0.5),
      max: am4core.color('#A62639').brighten(0.5),
    });

    // this.territorySeries.hide();// = usaLow;

    // Assign the hover colors to the jurisdictionPolygons and usaPolygons
    var hoverColor = this.usaPolygon.states.create('hover');
    hoverColor.properties.fill = this.chart.colors.getIndex(1);

    hoverColor = this.jurisdictionPolygon.states.create('hover');
    hoverColor.properties.fill = this.chart.colors.getIndex(1);

    hoverColor = this.territoryPolygon.states.create('hover');
    hoverColor.properties.fill = this.territoryChart.colors.getIndex(1);

    // selectedDateIndex will mostly likely be initialized as 0 (meaning the oldest date in our dataset)
    // this.updateDataWithNewDate(this.props.selectedDateIndex)
    this.updateJurisdictionData();
  };

  renderHeatLegend = dataSeries => {
    console.log(`CLM : Render Heat Legend`);
    console.log(this.props.jurisdictionToShow.category);
    let heatLegendReference = this.props.jurisdictionToShow.category === 'territory' ? this.territoryHeatLegend : this.heatLegend;
    heatLegendReference.id = 'heatLegend';
    heatLegendReference.series = dataSeries;
    heatLegendReference.align = 'right';
    heatLegendReference.valign = 'bottom';
    heatLegendReference.width = am4core.percent(25);
    heatLegendReference.marginRight = am4core.percent(4);
    heatLegendReference.background.fill = am4core.color('#3c5bdc');
    heatLegendReference.background.fillOpacity = 0.05;
    heatLegendReference.padding(5, 5, 5, 5);

    let minRange = heatLegendReference.valueAxis.axisRanges.create();
    minRange.label.horizontalCenter = 'left';

    let maxRange = heatLegendReference.valueAxis.axisRanges.create();
    maxRange.label.horizontalCenter = 'right';

    heatLegendReference.valueAxis.renderer.labels.template.adapter.add('text', () => ``);

    dataSeries.events.on('datavalidated', ev => {
      heatLegendReference = ev.target.map.getKey('heatLegend');
      let min = heatLegendReference.series.dataItem.values.value.low;
      let minRange = heatLegendReference.valueAxis.axisRanges.getIndex(0);
      minRange.value = min;
      minRange.label.text = '' + heatLegendReference.numberFormatter.format(min);
      let max = heatLegendReference.series.dataItem.values.value.high;
      let maxRange = heatLegendReference.valueAxis.axisRanges.getIndex(1);
      maxRange.value = max;
      maxRange.label.text = '' + heatLegendReference.numberFormatter.format(max);
    });
  };

  componentDidUpdate = prevProps => {
    // The ordering of these two if statements is important
    // If a new jurisdiction is specified, then transition to the new jurisdiction
    // Else if JUST the data has updated, then just update the data
    if (prevProps.jurisdictionToShow.name !== this.props.jurisdictionToShow.name) {
      this.transitionJurisdiction();
    } else if (prevProps.jurisdictionData !== this.props.jurisdictionData) {
      this.updateJurisdictionData();
    }
  };

  transitionJurisdiction = () => {
    console.log(`CountyLevelMaps : transitionJurisdiction`);
    if (this.props.jurisdictionToShow.category === 'fullCountry') {
      this.setState({ showTerritory: false }, () => {
        this.jurisdictionSeries.hide();
        this.usaSeries.show();
        this.chart.maxZoomLevel = 32;
        this.chart.goHome();
        setTimeout(() => {
          this.chart.maxZoomLevel = 1;
          this.updateJurisdictionData();
          this.props.decrementSpinnerCount();
          console.log('here:');
          console.log(this.usaSeries);
        }, 1050);
      });
    } else if (this.props.jurisdictionToShow.category === 'territory') {
      if (this.territorySeries.isHidden) this.territorySeries.show();
      this.territorySeries.geodata = this.props.mapObject;
      this.setState({ showTerritory: true }, () => {
        setTimeout(() => {
          this.territoryChart.goHome();
          this.updateJurisdictionData();
          this.props.decrementSpinnerCount();
        }, 1050);
      });
    } else if (this.props.jurisdictionToShow.category === 'state') {
      this.setState({ showTerritory: false }, () => {
        let ev = this.props.jurisdictionToShow.eventValue;
        this.chart.maxZoomLevel = 32;
        this.chart.zoomToMapObject(ev.target);
        // Rendering the Territory Level Chart causes the UI to hang
        // And if that hang comes during the zoom animation, it looks really choppy
        // Delaying the render by 1.05 seconds (That's how long the zoom takes - I timed it)
        // makes the UI feel more responsive
        setTimeout(() => {
          // this.chart.maxZoomLevel = 1;
          this.usaSeries.hide();
          this.jurisdictionSeries.geodata = this.props.mapObject;
          this.jurisdictionSeries.show();
          this.updateJurisdictionData();
          this.props.decrementSpinnerCount();
        }, 1050);
      });
    } else {
      console.error('THIS SHOULD NEVER HAPPEN');
    }
  };

  updateJurisdictionData = () => {
    console.log('updateJurisdictionData');
    let data = [];
    if (this.props.jurisdictionToShow.category === 'fullCountry') {
      let nonCustomJurisdictions = stateOptions.filter(jurisdiction => !_.some(customTerritories, v => v.name === jurisdiction.name));
      nonCustomJurisdictions.forEach(region => {
        data.push({
          id: `US-${region.abbrv}`,
          map: region.mapFile,
          value: this.props.jurisdictionData[region.name] || 0,
        });
      });
      this.usaSeries.data = data;
      this.renderHeatLegend(this.usaSeries);
      this.props.decrementSpinnerCount();
    } else if (this.props.jurisdictionToShow.category === 'territory') {
      console.log('I need to make a write code to handle TERRITORY');
      let counties = this.territorySeries.geodata.features;
      counties.forEach(county => {
        data.push({
          id: `${county.id}`,
          value: parseInt(Math.random() * 50),
        });
      });
      this.territorySeries.data = data;
      this.renderHeatLegend(this.territorySeries);
    } else if (this.props.jurisdictionToShow.category === 'state') {
      let counties = this.jurisdictionSeries.geodata.features;
      counties.forEach(county => {
        data.push({
          id: `${county.id}`,
          color: am4core.color('#3B9CD9'),
          value: this.props.jurisdictionData[String(county?.properties?.name)] || 0,
        });
      });
      this.jurisdictionSeries.data = data;
      this.renderHeatLegend(this.jurisdictionSeries);
    } else {
      console.error('THIS SHOULD NEVER HAPPEN');
    }
  };

  render() {
    return (
      <div className="map-panel-contaianer">
        <div id={`chartdiv-${this.customID}`} className={this.state.showTerritory ? 'hidden-map-container' : 'visible-map-container'}></div>
        <div id={`territorydiv-${this.customID}`} className={this.state.showTerritory ? 'visible-map-container' : 'hidden-map-container'}></div>
      </div>
    );
  }
}

CountyLevelMaps.propTypes = {
  jurisdictionToShow: PropTypes.object,
  jurisdictionData: PropTypes.object,
  mapObject: PropTypes.object,
  handleJurisdictionChange: PropTypes.func,
  decrementSpinnerCount: PropTypes.func,
};

export default CountyLevelMaps;

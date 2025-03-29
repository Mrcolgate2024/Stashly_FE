import React, { useEffect, useRef } from 'react';
import embed, { VisualizationSpec, Result } from 'vega-embed';

interface ChartProps {
  spec: VisualizationSpec;
  className?: string;
  onCaptureImage?: (imageData: string) => void;
}

/**
 * Renders a Vega-Lite chart specification passed in as `spec`.
 */
const ChartComponent: React.FC<ChartProps> = ({ 
  spec, 
  className = "",
  onCaptureImage
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const vegaResultRef = useRef<Result | null>(null);

  // Function to capture the chart as an image
  const captureChartAsImage = () => {
    if (vegaResultRef.current) {
      try {
        // Get the chart's canvas/svg
        const view = vegaResultRef.current.view;
        
        // Create a PNG image and return data URL
        const imageData = view.toImageURL('png')
          .then(url => {
            if (onCaptureImage) {
              onCaptureImage(url);
            }
            return url;
          })
          .catch(error => {
            console.error('Error capturing chart as image:', error);
            return null;
          });
        
        return imageData;
      } catch (error) {
        console.error('Error in captureChartAsImage:', error);
      }
    }
    return null;
  };

  useEffect(() => {
    console.log('ChartComponent received spec:', spec);
    
    if (chartRef.current && spec) {
      // Create a modified spec with responsive width and height
      const chartSpec = {
        ...spec,
        $schema: 'https://vega.github.io/schema/vega-lite/v5.8.0.json',
        // Set width to container width
        width: "container",
        // Set a reasonable height
        height: 300,
        // Make the chart responsive
        autosize: {
          type: 'fit',
          contains: 'padding'
        }
      };

      console.log('Attempting to render chart with spec:', chartSpec);

      // vegaEmbed returns a promise
      embed(chartRef.current, chartSpec as VisualizationSpec, {
        actions: false,
        theme: 'excel',
        renderer: 'svg'  // Use SVG renderer for better quality
      })
      .then(result => {
        vegaResultRef.current = result;
        // If there's an onCaptureImage prop, expose the captureChartAsImage function
        if (onCaptureImage) {
          // Add a small delay to ensure the chart is fully rendered
          setTimeout(() => {
            captureChartAsImage();
          }, 500);
        }
      })
      .catch(error => {
        console.error('Error rendering chart:', error);
      });
    } else {
      console.log('Chart not rendered:', { hasRef: !!chartRef.current, hasSpec: !!spec });
    }
    
    // Cleanup function
    return () => {
      if (vegaResultRef.current) {
        vegaResultRef.current.view.finalize();
      }
    };
  }, [spec, onCaptureImage]);

  // Expose the captureChartAsImage method to the parent component
  React.useImperativeHandle(
    { current: { captureChartAsImage } },
    () => ({ captureChartAsImage })
  );

  return <div ref={chartRef} className={`${className} min-h-[200px]`} />;
};

export default ChartComponent; 
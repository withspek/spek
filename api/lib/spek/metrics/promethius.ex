defmodule Spek.Metrics.PipelineInstrumenter do
  use Prometheus.PlugPipelineInstrumenter

  def label_value(:request_path, conn) do
    conn.request_path
  end
end

defmodule Spek.Metrics.PrometheusExporter do
  use Prometheus.PlugExporter
end

defmodule Spek.Metrics.UserSessions do
  use Prometheus.Metric

  def setup do
    Gauge.declare(
      name: :user_sessions,
      help: "Number of user sesisons"
    )
  end

  def set(n) do
    Gauge.set([name: :user_sessions], n)
  end
end

# Data Presentation Patterns

## Table of Contents

1. [Data Tables](#1-data-tables)
2. [Dashboards](#2-dashboards)

---

This document provides patterns for presenting complex data in corporate web applications, focusing on data tables and dashboards.

## 1. Data Tables

Data tables are the most common and effective way to display large, structured datasets in enterprise applications. A well-designed table allows users to scan, compare, and act on data efficiently.

### Key Principles

- **Readability is Paramount**: The design must optimize for quick scanning and comparison.
- **Give Users Control**: Allow users to customize the view to fit their specific needs.
- **Actions in Context**: Provide actions where the user needs them, without cluttering the interface.

### Anatomy & Best Practices

| Element | Best Practice |
|---|---|
| **Alignment** | - **Text**: Left-align. <br> - **Numbers**: Right-align. <br> - **Headers**: Align with their column content. <br> - **NEVER** use center alignment. |
| **Typography** | Use a **monospace/tabular font** for all numeric columns to ensure numbers align correctly for easy comparison. |
| **Row Style** | Use simple **line divisions** between rows. Avoid zebra stripes, as they create visual noise and complicate hover/selected states. |
| **Column Management** | - **Sticky Header**: The table header must remain visible on vertical scroll. <br> - **Freeze Columns**: The first column (and action columns) should be frozen on horizontal scroll. <br> - **Customization**: Allow users to **reorder, hide, and resize** columns. Always provide a "Reset to Default" option. |
| **Display Density** | Provide options for users to switch between display densities: <br> - **Compact**: For power users who need to see maximum data. <br> - **Comfortable**: A balanced default. <br> - **Spacious**: For readability and touch-friendliness. |
| **Actions** | - **Bulk Actions**: Display a toolbar above the table *only after* the user selects one or more rows. <br> - **Row-Level Actions**: Reveal actions (e.g., Edit, Delete) on hover to reduce visual clutter. |
| **Pagination** | Use clear pagination controls at the bottom of the table. Include a "rows per page" selector. |

### Example: Accessible Data Table Template

An HTML template for an accessible data table is provided in `templates/data-table.html`.

---

## 2. Dashboards

Dashboards provide a high-level, at-a-glance view of key performance indicators (KPIs), metrics, and system status. They are a central component of many corporate applications.

### Key Principles

- **Role-Based**: The information displayed should be tailored to the user's role and objectives.
- **Scannable**: The most important information should be immediately obvious. Use visual hierarchy to guide the user's eye.
- **Actionable**: Dashboards should not just display data; they should provide pathways to investigate and act on that data.

### Layout & Content

- **Inverted Pyramid**: Place the most critical, summary-level information at the top-left. As the user moves down and to the right, provide more detailed information.
- **Use a Grid**: A consistent grid system (like the one in `responsive.css`) is essential for a clean, organized layout.
- **Group Related Information**: Use cards or tiles to group related metrics. Use whitespace to create clear separation between groups.
- **Prioritize Data, Not Decoration**: Avoid superfluous icons or illustrations that can distract from the data itself. The data is the interface.
- **Provide Drill-Downs**: Each dashboard component should be a gateway to more detailed information. Clicking on a chart or KPI should navigate the user to a more detailed report or data table.

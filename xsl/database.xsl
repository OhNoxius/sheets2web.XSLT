<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" encoding="UTF-8" />

	<xsl:param name="input" />
	<xsl:param name="id" />

	<xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyzéèëêàçö'" />
	<xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZEEEEACO'" />
	<xsl:variable name="mainsheet" select="name(/*[1]/*[1])" />
	<xsl:variable name="linkedsheet" select="name(/*[1]/*[starts-with(name(.), '_')])" />

	<xsl:template match="/">
		<xsl:apply-templates select="*[1]" mode="heading" />
	</xsl:template>

	<!--HEADING-->
	<xsl:template match="*[1]" mode="heading">
		<!-- CHOOSE MODE: main sheet OR find childnodes in linkedsheet -->
		<xsl:choose>
			<xsl:when test="$id">
				<xsl:apply-templates select="*[starts-with(name(.), '_')]" mode="linkedsheet" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates select="*[1]" mode="mainsheet" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- LINKED SHEET -->
	<xsl:template match="*" mode="linkedsheet">
		<table class="linkedsheet row-border">
			<thead>
				<xsl:apply-templates select="*[1]" mode="autoheader" />
			</thead>
			<tbody>
				<xsl:apply-templates select="child::*[attribute::*[local-name() = $mainsheet] = $id]" mode="autovalues" />
			</tbody>
		</table>
	</xsl:template>

	<!--MAIN SHEET-->
	<xsl:template match="*[1]" mode="mainsheet">
		<table class="mainsheet row-border hover" id="{local-name(.)}">
			<thead>
				<xsl:apply-templates select="*[1]" mode="autoheader" />
			</thead>
			<tbody>
				<xsl:choose>
					<xsl:when test="$input = ''">
						<xsl:apply-templates select="child::*" mode="autovalues" />
					</xsl:when>
					<xsl:otherwise>
						<!-- PERFORM SEARCH -->
						<xsl:apply-templates select="child::*[@*[contains(translate(., $smallcase, $uppercase), translate($input, $smallcase, $uppercase))] or *[contains(translate(., $smallcase, $uppercase), translate($input, $smallcase, $uppercase))]]" mode="autovalues" />
					</xsl:otherwise>
				</xsl:choose>
			</tbody>
		</table>
	</xsl:template>

	<!-- RUN THROUGHT ATTRIBUTES: make header -->
	<xsl:template match="*[1]" mode="autoheader">
		<tr>
			<xsl:apply-templates select="child::*[1]" mode="details-control-header" />
			<!-- COUNT column -->
			<th class="linkedinfo" />

			<xsl:apply-templates select="attribute::*[not(local-name() = $mainsheet)]" mode="attributes-header">
				<xsl:sort select="position()" order="ascending" data-type="number" />
			</xsl:apply-templates>

			<xsl:apply-templates select="child::*" mode="children-header" />
		</tr>
	</xsl:template>

	<xsl:template match="attribute::*" mode="attributes-header" priority="0">
		<xsl:variable name="nextpos" select="position()+1" />
		<xsl:if test="not(starts-with(substring(name(.), 2), '-')) and not(starts-with(substring(name(.), 2), '('))">
			<th>
				<xsl:if test="position() = 1">
					<xsl:attribute name="class">
						<xsl:text>titlecolumn</xsl:text>
					</xsl:attribute>
				</xsl:if>
				<xsl:value-of select="name(.)" />
			</th>
		</xsl:if>
	</xsl:template>

	<!-- RUN THROUGHT ATTRIBUTES: fill in values -->
	<xsl:template match="child::*" mode="autovalues">
		<tr id="{@id}">
			<xsl:apply-templates select="child::*[1]" mode="details-control-values" />
			<!-- COUNT linked items -->
			<td class="linkedinfo">
				<xsl:value-of select="count(/*/_version/*[attribute::*[local-name(.) = $mainsheet] = current()/@id])" />
			</td>

			<xsl:apply-templates select="attribute::*[local-name() != $mainsheet]" mode="attributes-values">
				<xsl:sort select="position()" order="ascending" data-type="number" />
			</xsl:apply-templates>

			<xsl:apply-templates select="child::*" mode="children-values" />
		</tr>
	</xsl:template>
	<xsl:template match="attribute::*" mode="attributes-values" priority="0">
		<xsl:if test="not(starts-with(substring(name(.), 2), '-'))">
			<td>
				<!-- CREATE @title for hover tooltip (SLOW) -->
				<xsl:if test="string(.) != ''">
					<xsl:attribute name="title">
						<xsl:apply-templates select="/*[1]/*[local-name(.) = local-name(current())]/*[attribute::*[1] = current()]/attribute::*" mode="hover" />
					</xsl:attribute>
				</xsl:if>
				<!-- END hover tooltip -->
				<xsl:value-of select="." />
				<!-- COLUMN FORMAT FEATURES (could also be done in DataTables -->
				<xsl:variable name="nextpos" select="position()+1" />
				<xsl:if test="string-length(./parent::*/@*[position()=$nextpos])">
					<xsl:if test="starts-with(substring(name(./parent::*/@*[position()=$nextpos]), 2), '(')">
						<span class="inline">
							<xsl:text>(</xsl:text>
							<xsl:value-of select="./parent::*/@*[position()=$nextpos]" />
							<xsl:text>)</xsl:text>
						</span>
					</xsl:if>
					<xsl:if test="starts-with(substring(name(./parent::*/@*[position()=$nextpos]), 2), '-')">
						<p class="details">
							<xsl:value-of select="./parent::*/@*[position()=$nextpos]" />
						</p>
					</xsl:if>
				</xsl:if>
			</td>
		</xsl:if>
	</xsl:template>

	<xsl:template match="child::*" mode="children-header" priority="0">
		<th class="noVis">
			<xsl:value-of select="name(.)" />
		</th>
	</xsl:template>
	<xsl:template match="child::*" mode="children-values" priority="0">
		<td>
			<xsl:value-of select="." />
		</td>
	</xsl:template>

	<xsl:template match="child::*[1]" mode="details-control-header">
		<th class="details-control"><!-- details --></th>
	</xsl:template>
	<xsl:template match="child::*[1]" mode="details-control-values">
		<td><!-- details --></td>
	</xsl:template>

	<!-- FORMAT hover tooltip -->
	<xsl:template match="attribute::*" mode="hover">
		<xsl:value-of select="local-name(.)" />
		<xsl:text>: </xsl:text>
		<xsl:value-of select="." />
		<xsl:text>&#10;</xsl:text>
	</xsl:template>

	<!-- AUTO OVERRIDE some common headers........................................................... -->
	<xsl:template match="@id" mode="attributes-header">
		<!--<xsl:attribute name="id">
			<xsl:value-of select="." />
		</xsl:attribute>-->
	</xsl:template>
	<xsl:template match="@id" mode="attributes-values">
		<!--<xsl:value-of select="." />-->
	</xsl:template>
	<xsl:template match="@DATUM | @Datum | @datum | @date | @rec_date" mode="attributes-header">
		<th class="date">
			<xsl:value-of select="name(.)" />
		</th>
	</xsl:template>

</xsl:stylesheet>
